// all code by Ranjan kashyap
    import { MDCTextField } from "https://cdn.skypack.dev/@material/textfield";
  
    import {
  TextClassifier,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0";

    const spinner = '<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24"><use href="#icon.spinner"></use></svg>'

      let textClassifier;
    const input = document.getElementById("input");
    const submit = document.getElementById("submit");
    let positive = document.querySelector('[data-positive]')
    let negetive = document.querySelector('[data-negetive]')
    let exampleButton = document.getElementById('example')
    let loader = document.getElementById('loader')
   document.querySelector('img').onclick = function(){
    alert("Made By Ranjan Kashyap\nKashyapranjan9977@gmail.com")
   }
    let Expamples = [
      "I had a fantastic day at the beach with my friends!",
      "I had a terrible experience with customer service; they were rude and unhelpful.",
      "The movie I watched yesterday was incredibly heartwarming and inspiring.",
      "The weather ruined our outdoor plans, and I ended up getting soaked in the rain",
      "I'm so grateful for the support and kindness shown by my colleagues.",
      "The restaurant we went to had terrible food and slow service, making the evening disappointing.",
      "love spending time with my family during the holidays; it's always filled with laughter and joy",
      "was really upset when my computer crashed right before I could save my important work", 
      "My recent travel experience was marred by a series of unfortunate events. Flight delays, lost luggage, and subpar accommodations turned what should have been a relaxing vacation into a stressful ordeal.",
      " recently embarked on a vacation to a picturesque mountain retreat, and the experience was nothing short of magical. The serene landscapes, fresh mountain air, and the company of my loved ones made every moment unforgettable",
      "Exploring a new recipe in the kitchen turned out to be a delightful adventure. The aroma of freshly baked bread filled the air, and sharing the meal with my family led to an evening of laughter and contentment",
      "Attending the family gathering ended up being quite draining. Heated arguments and unresolved tensions among relatives cast a shadow over what should have been a joyful occasion",
      " was looking forward to a movie night, but the film I selected turned out to be a major disappointment. The plot was confusing, and the acting left much to be desired, leaving me unsatisfied",
    ]
     
input.value =  Expamples[Math.floor(Math.random() * Expamples.length)]
let ExpamplesCount = 0
    exampleButton.onclick = ()=>{
      exampleButton.innerHTML = `Examples ${ExpamplesCount+1}`
       input.value = Expamples[ExpamplesCount]
       ExpamplesCount++
       if(ExpamplesCount >= Expamples.length){
        ExpamplesCount = 0
       }
    }

    async function createTextClassifier() {
      const text = await FilesetResolver.forTextTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm"
      );
      textClassifier = await TextClassifier.createFromOptions(text, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/text_classifier/bert_classifier/float32/1/bert_classifier.tflite`
        },
        maxResults: 5
      });

     loader.classList.add("hide")
    }

    async function classifyText() {
  if (!textClassifier) {
    console.error("Text classifier is not yet initialized.");
    return;
  }

  if (input.value === "") {
    alert("Please write some text, or click 'Populate text' to add text");
    return;
  }
  submit.innerHTML = `Predicting...`
  await sleep(500); 
  const result = textClassifier.classify(input.value);
  displayClassificationResult(result);
}
    function displayClassificationResult(result) {
  submit.innerHTML = `Predict`
  let preditctResult = result.classifications[0].categories



preditctResult.forEach(text=>{
  if(text.categoryName==="positive"){
    positive.innerHTML = progress(text.score)
    positive.style.width =progress(text.score)
  }else{
    negetive.innerHTML = progress(text.score)
negetive.style.width = progress(text.score)

  }
  if(text.score*100>= 60){
    textToSpeech(text.categoryName)
  }
})  }

    function progress(value ){
      return Math.round(value*100)+"%"
    }

    submit.addEventListener("click", classifyText);
    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    createTextClassifier();


    function textToSpeech(text) {
  var utterance = new SpeechSynthesisUtterance(text);

 
  utterance.voice = window.speechSynthesis.getVoices()[12]
  speechSynthesis.speak(utterance);
}

