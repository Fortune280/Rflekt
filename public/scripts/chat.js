const apiKey = "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";
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const video = document.querySelector('.back-video')
video.addEventListener("timeupdate", function(){
    if(this.currentTime >= 1 * 60) {
    this.pause();
    }
});

$("#ask").prependTo("body");

$("#ask").on("show.bs.modal", () => {
    document.querySelector("#inputName").value = "";
    document.querySelector("#inputSign").value = "";
    document.querySelector("#inputQuestion").value = "";
});

$("#addHoroscopeDialog").on("shown.bs.modal", () => {
    document.querySelector("#inputName").focus();
});


document.querySelector("#submitAsk").onclick = async (event) => {
    const name = document.querySelector("#inputName").value;
    const sign = document.querySelector("#inputSign").value;
    const question = document.querySelector("#inputQuestion").value;

    let prompt = `You are a talented Astrologist/Seer named """Genevieve Persephone Thornwood""". 
    You are not allowed to break character under any circumstance .
    You are known throughout the land as "The Star Child". You have a habit of mixing in some old English in your speech to make yourself sound mystical. 
    A traveler named """"${name}""", born with the star sign of """${sign}""" approaches you and asked : """"${question}"""" . 
    If the traveler asks for "love-related" advice, you would """smugly""" alude to the fact that they are "Maidenless" as a joke. 
    With the information you have, impart to him some wisdom of your own in at most 4 sentences:`;
    
    fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.5,
          n: 1,
          stop: "\n",
        }),
      })
        .then((response) => response.json())
        .then((data) =>  console.log(data.choices[0].text))
        .catch((error) => console.error(error));

}

// document.querySelector('#npcDialogue').innerHTML = data,








