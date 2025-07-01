    // window.watsonAssistantChatOptions = {
    //   integrationID: "31f14d43-e64c-4585-9998-06ed64317c6e", // Your integration ID
    //   region: "us-south", // Your region
    //   serviceInstanceID: "facfb8a8-7bfe-4a6d-9b2a-e40e7efda404", // Your service instance ID
    //   onLoad: async (instance) => { 
    //     await instance.render();
    //     console.log('Watson Assistant loaded successfully');
    //   },
    //   // Optional customization
    //   showLauncher: true, // Shows the chat button
    //   carbonTheme: 'white',
    // };
    
    // // Load Watson Assistant
    // setTimeout(function(){
    //   const t = document.createElement('script');
    //   t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + 
    //           (window.watsonAssistantChatOptions.clientVersion || 'latest') + 
    //           "/WatsonAssistantChatEntry.js";
    //   document.head.appendChild(t);
    // });


  
window.watsonAssistantChatOptions = {
  integrationID: "c02b9cba-16d9-4091-bba0-3f9793c17147",
  region: "us-south",
  serviceInstanceID: "facfb8a8-7bfe-4a6d-9b2a-e40e7efda404",
  onLoad: async (instance) => { 
    await instance.render(); 
  }
};

// More reliable script loading
const t = document.createElement('script');
t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + 
        (window.watsonAssistantChatOptions.clientVersion || 'latest') + 
        "/WatsonAssistantChatEntry.js";
document.head.appendChild(t);
