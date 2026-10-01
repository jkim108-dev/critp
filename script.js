// ========================================
// DATE
// ========================================

const currentDate =
  document.getElementById("currentDate");

const paperDate =
  document.getElementById("paperDate");


const today = new Date();


const formattedDate =
  today.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ).toUpperCase();


currentDate.textContent =
  formattedDate;

paperDate.textContent =
  formattedDate;



// ========================================
// FORM ELEMENTS
// ========================================

const projectTitle =
  document.getElementById("projectTitle");

const imageInput =
  document.getElementById("imageInput");

const imageFileName =
  document.getElementById("imageFileName");

const imageUploadText =
  document.getElementById("imageUploadText");

const transcript =
  document.getElementById("transcript");

const generateBtn =
  document.getElementById("generateBtn");

const printBtn =
  document.getElementById("printBtn");



// ========================================
// NEWSPAPER ELEMENTS
// ========================================

const paperTitle =
  document.getElementById("paperTitle");

const summaryText =
  document.getElementById("summaryText");

const feedbackList =
  document.getElementById("feedbackList");

const quoteText =
  document.getElementById("quoteText");

const nextSteps =
  document.getElementById("nextSteps");

const paperImage =
  document.getElementById("paperImage");

const imagePlaceholder =
  document.getElementById("imagePlaceholder");



// ========================================
// IMAGE UPLOAD
// ========================================

imageInput.addEventListener(
  "change",
  function(event) {

    const file =
      event.target.files[0];


    if (!file) {
      return;
    }


    imageFileName.textContent =
      file.name;


    imageUploadText.textContent =
      "IMAGE SELECTED";


    const reader =
      new FileReader();


    reader.onload =
      function(e) {

        paperImage.src =
          e.target.result;


        paperImage.style.display =
          "block";


        imagePlaceholder.style.display =
          "none";

      };


    reader.readAsDataURL(file);

  }
);



// ========================================
// RECORDING ELEMENTS
// ========================================

const recordBtn =
  document.getElementById("recordBtn");

const recordStatus =
  document.getElementById("recordStatus");

const recordTimer =
  document.getElementById("recordTimer");

const recordDot =
  document.getElementById("recordDot");

const audioPlayback =
  document.getElementById("audioPlayback");

const audioName =
  document.getElementById("audioName");



// ========================================
// RECORDING VARIABLES
// ========================================

let mediaRecorder = null;

let mediaStream = null;

let audioChunks = [];

let recordedAudioBlob = null;

let isRecording = false;

let timerInterval = null;

let recordingSeconds = 0;



// ========================================
// TIMER
// ========================================

function updateTimer() {

  const minutes =
    Math.floor(
      recordingSeconds / 60
    );


  const seconds =
    recordingSeconds % 60;


  recordTimer.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}



function startTimer() {

  recordingSeconds = 0;


  updateTimer();


  timerInterval =
    setInterval(
      () => {

        recordingSeconds++;

        updateTimer();

      },
      1000
    );

}



function stopTimer() {

  if (timerInterval) {

    clearInterval(
      timerInterval
    );

    timerInterval = null;

  }

}



// ========================================
// GET SUPPORTED RECORDING TYPE
// ========================================

function getSupportedMimeType() {

  const types = [

    "audio/webm;codecs=opus",

    "audio/webm",

    "audio/mp4",

    "audio/ogg;codecs=opus"

  ];


  for (
    const type of types
  ) {

    if (
      MediaRecorder.isTypeSupported(type)
    ) {

      return type;

    }

  }


  return "";

}



// ========================================
// START RECORDING
// ========================================

async function startRecording() {

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    alert(
      "Your browser does not support microphone recording."
    );

    return;

  }


  try {

    mediaStream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });


    const mimeType =
      getSupportedMimeType();


    if (mimeType) {

      mediaRecorder =
        new MediaRecorder(
          mediaStream,
          {
            mimeType: mimeType
          }
        );

    }

    else {

      mediaRecorder =
        new MediaRecorder(
          mediaStream
        );

    }


    audioChunks = [];


    mediaRecorder.addEventListener(
      "dataavailable",
      event => {

        if (
          event.data.size > 0
        ) {

          audioChunks.push(
            event.data
          );

        }

      }
    );


    mediaRecorder.addEventListener(
      "stop",
      () => {

        const actualType =
          mediaRecorder.mimeType ||
          "audio/webm";


        recordedAudioBlob =
          new Blob(
            audioChunks,
            {
              type: actualType
            }
          );


        const audioURL =
          URL.createObjectURL(
            recordedAudioBlob
          );


        audioPlayback.src =
          audioURL;


        audioPlayback.style.display =
          "block";


        audioName.textContent =
          `Critique recording ready · ${formatTime(recordingSeconds)}`;


        recordStatus.textContent =
          "Recorded";


        stopMicrophone();

      }
    );


    mediaRecorder.start();


    isRecording =
      true;


    recordBtn.textContent =
      "STOP RECORDING";


    recordBtn.classList.add(
      "recording"
    );


    recordDot.classList.add(
      "active"
    );


    recordStatus.textContent =
      "Recording";


    audioPlayback.style.display =
      "none";


    audioName.textContent =
      "Recording critique...";


    startTimer();

  }

  catch (error) {

    console.error(
      "Microphone error:",
      error
    );


    alert(
      "Microphone access is required. Please allow microphone permission in your browser."
    );

  }

}



// ========================================
// STOP RECORDING
// ========================================

function stopRecording() {

  if (
    !mediaRecorder ||
    mediaRecorder.state === "inactive"
  ) {

    return;

  }


  mediaRecorder.stop();


  isRecording =
    false;


  recordBtn.textContent =
    "START RECORDING";


  recordBtn.classList.remove(
    "recording"
  );


  recordDot.classList.remove(
    "active"
  );


  recordStatus.textContent =
    "Processing";


  stopTimer();

}



// ========================================
// STOP MICROPHONE COMPLETELY
// ========================================

function stopMicrophone() {

  if (!mediaStream) {
    return;
  }


  mediaStream
    .getTracks()
    .forEach(
      track => {

        track.stop();

      }
    );


  mediaStream =
    null;

}



// ========================================
// FORMAT TIME
// ========================================

function formatTime(
  totalSeconds
) {

  const minutes =
    Math.floor(
      totalSeconds / 60
    );


  const seconds =
    totalSeconds % 60;


  return (
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`
  );

}



// ========================================
// RECORD BUTTON
// ========================================

recordBtn.addEventListener(
  "click",
  function() {

    if (!isRecording) {

      startRecording();

    }

    else {

      stopRecording();

    }

  }
);



// ========================================
// TEMPORARY FAKE AI
// ========================================

function generateFakeAI(
  text
) {

  const cleanedText =
    text
      .replace(/\s+/g, " ")
      .trim();


  let excerpt =
    cleanedText;


  if (
    excerpt.length > 260
  ) {

    excerpt =
      excerpt.substring(
        0,
        260
      ) + "...";

  }


  return {

    summary:
      `Today's critique focused on how clearly the project communicates its main idea and how effectively its form supports the intended experience. Reviewers discussed interaction, visual language, usability, and the next stage of development. ${excerpt}`,

    feedback: [

      "Make the primary interaction easier to understand without additional explanation.",

      "Strengthen the relationship between the physical form and the core concept.",

      "Use the next prototype to test scale, usability, and material decisions."

    ],

    quote:
      "The idea is strong, but the experience needs to communicate itself more clearly.",

    next: [

      "Simplify the main interaction.",

      "Test the prototype with users.",

      "Refine form and material."

    ]

  };

}



// ========================================
// GENERATE NEWSPAPER
// ========================================

generateBtn.addEventListener(
  "click",
  function() {

    const title =
      projectTitle.value.trim();


    const transcriptText =
      transcript.value.trim();



    if (!title) {

      alert(
        "Please enter a project title."
      );

      projectTitle.focus();

      return;

    }



    if (!transcriptText) {

      alert(
        "Please paste the critique transcript for now."
      );

      transcript.focus();

      return;

    }



    // TITLE

    paperTitle.textContent =
      title.toUpperCase();



    // GENERATE TEMPORARY AI CONTENT

    const result =
      generateFakeAI(
        transcriptText
      );



    // SUMMARY

    summaryText.textContent =
      result.summary;



    // FEEDBACK

    feedbackList.innerHTML =
      "";


    result.feedback.forEach(
      feedback => {

        const li =
          document.createElement(
            "li"
          );


        li.textContent =
          feedback;


        feedbackList.appendChild(
          li
        );

      }
    );



    // QUOTE

    quoteText.textContent =
      `“${result.quote}”`;



    // NEXT STEPS

    nextSteps.innerHTML =
      "";


    result.next.forEach(
      (
        step,
        index
      ) => {

        const div =
          document.createElement(
            "div"
          );


        div.innerHTML =
          `
            <span>
              ${String(index + 1).padStart(2, "0")}
            </span>

            ${step}
          `;


        nextSteps.appendChild(
          div
        );

      }
    );



    // MOVE TO PREVIEW

    document
      .querySelector(
        ".preview-area"
      )
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }
);



// ========================================
// PRINT
// ========================================

printBtn.addEventListener(
  "click",
  function() {

    window.print();

  }
);



// ========================================
// SAFETY: STOP MIC IF PAGE CLOSES
// ========================================

window.addEventListener(
  "beforeunload",
  function() {

    stopMicrophone();

  }
);