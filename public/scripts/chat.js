// Don't push api key

const apiKey = "PUT HERE";
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const video = document.querySelector('.back-video')
video.addEventListener("timeupdate", function(){
    if(this.currentTime >= 0 * 60) {
    this.pause();
    }
});


// dynamic content generation
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


function _createtext(text) {
	return htmlToElement(`
    <p1 id="npcDialogue" class="animated animatedFadeInUp fadeInUp">${text}</p1>
    `);


};


function generateContent(text) {
	const newList = htmlToElement('<div id="dialogueContainer" class="container-fluid justify-content-center"></div>')
	const newtext = _createtext(text);

	newList.appendChild(newtext);

	const oldList = document.querySelector("#dialogueContainer");

	oldList.removeAttribute("id");
	oldList.hidden = true;
	oldList.parentElement.appendChild(newList);

}

//================= Who ask

$("#ask").prependTo("body");

$("#ask").on("show.bs.modal", () => {
    document.querySelector("#inputName").value = "";
    document.querySelector("#inputSign").value = "";
    document.querySelector("#inputQuestion").value = "";
});

$("#addHoroscopeDialog").on("shown.bs.modal", () => {
    document.querySelector("#inputName").focus();
});

//===================
document.querySelector("#submitAsk").onclick = async (event) => {
    const name = document.querySelector("#inputName").value;
    const sign = document.querySelector("#inputSign").value;
    const question = document.querySelector("#inputQuestion").value;

    let prompt = `You are a talented Astrologist/Seer named """Galadriel Prismar Thornevale""". 
    You are not allowed to break character under any circumstance.
    You are known throughout the land as "the Oracle of the Celestial Will".
    You have a habit of mixing in old English in your speech to make yourself sound sophisticated. 
    A traveler named """"${name}""", born with the star sign of """${sign}""" approaches you and asked : """"${question}"""" . 
    If the traveler asks for "love-related" advice, or "compatibility with another person" 
    you would """smugly""" roast them by mentioning the fact that they are currently and how desperate they are "Maidenless" as a joke. 
    With the information you have, impart to them some wisdom of your own in at most 4 sentences.
    Finish speaking with the phrase """"FinishedGeneration""" to let me know that you are done`;
    
    fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.5,
          n: 1,
          stop: "FinishedGeneration",
        }),
      })
        .then((response) => response.json())
        .then((data) =>  data.choices[0].text)
        .then((text)=> text.replace(/\\n/g, ""))
        .then((text)=> text.match(/(\b[a-zA-Z].+)/gm))
        .then((matches) => matches[0])
        .then((string) => generateContent(string))
        .catch((error) => console.error(error));

}
