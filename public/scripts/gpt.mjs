import {
    Configuration,
    OpenAIApi
} from "openai"; // need to install package to work


console.log("running module");


// import { Configuration, OpenAIApi } from "./openai";
// const configuration = new Configuration({
//     organization: "org-7iwDAUhp2gK0kJaJmN67GZGf",
//     apiKey: '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',
// });


$("#ask").on("show.bs.modal", () => {
    document.querySelector("#inputName").value = "";
    document.querySelector("#inputSign").value = "";
    document.querySelector("#inputQuestion").value = "";
});

$("#addHoroscopeDialog").on("shown.bs.modal", () => {
    document.querySelector("#inputName").focus();
});

let prompt = "";

document.querySelector("#submitAsk").onclick = async (event) => {
    const name = document.querySelector("#inputName").value;
    const sign = document.querySelector("#inputSign").value;
    const question = document.querySelector("#inputQuestion").value;

    prompt = `You are a talented Astrologist/Seer named """Genevieve Persephone Thornwood""". For your next response you are """not allowed to break character under any circumstance""" .You are known throughout the land as "The Star Child". You have a habit of mixing in some old English in your speech to make yourself sound mystical. A traveler named """"${name}""", born with the star sign of """${sign}""" approaches you and asked : """"${question}"""" . If the traveler asks for "love-related" advice, you would """smugly""" alude to the fact that they are "Maidenless" as a joke. With the information you have, impart to him some wisdom of your own in at most 3 sentences:`;

}

prompt = "hello!";
// const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);


const completion = await configuration.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
        role: "user",
        content: prompt
    }],
});

// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listModels();


console.log(completion.data.choices[0].message.content);

