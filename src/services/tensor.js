
export function createModel () {
  const model = tf.sequential()
  // tfvis.show.modelSummary({ name: 'Model Summary' }, model)
  model.add(tf.layers.dense({ inputShape: [1], units: 50 }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 1 }))
  return model
}

export async function convertToTensor (carsObjArray, model) {
  // intermediate tensors.
  const cars = carsObjArray
  const tidy = await tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(cars)

    // Step 2. Convert data to Tensor
    const inputs = cars.map(d => d.horsepower)
    const labels = cars.map(d => d.mpg)

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin
    }
  })
  const trainedModel = await trainModel(tidy.inputs, tidy.labels, model)
  return {
    ...tidy,
    trainedModel
  }
}

async function trainModel (inputs, labels, model) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse']
  })

  const batchSize = 28
  const epochs = 50

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}

export function testModel (model, inputData, normalizationData) {

  const { inputMax, inputMin, labelMin, labelMax } = normalizationData
  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100)
    const preds = model.predict(xs.reshape([100, 1]))

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin)

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin)

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] }
  })

  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg
  }))

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )
  return predictedPoints
}
