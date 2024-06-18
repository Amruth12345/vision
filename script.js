"use strict";

$(document).ready(function () {
    const video = $("#video")[0];
    const canvas = $("#canvas")[0];
    const context = canvas.getContext('2d');
    const errorMsgElement = $("#ErrorMsg");

    const constraints = {
        video: {
            facingMode: "user" // Prefer the front camera on mobile devices
        }
    };

    function handleSuccess(stream) {
        window.stream = stream;
        video.srcObject = stream;
    }

    function handleError(error) {
        errorMsgElement.text(`Error accessing camera: ${error.toString()}`);
    }

    async function init() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                handleSuccess(stream);
            } catch (e) {
                handleError(e);
            }
        } else {
            handleError(new Error('getUserMedia is not supported in this browser.'));
        }
    }

    // Load init
    init();

    // Capture image and send to server
    $("#snap").on("click", function () {
        // Set canvas dimensions to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        $(".canvas-wrap").show();
        $("#video").hide();
        $("#snap").hide();
        $(".video-wrap").hide();
        $("#retake").show();
        $("#next").show();

        // Get the data URL of the image
        const imageUrl = canvas.toDataURL("image/jpeg");

        // Create an object to send
        const object = {
            name: "1",
            img_url: imageUrl
        };

        // Log the object (or send to server)
        console.log(object);
    });

    // Retake image
    $("#retake").on("click", function () {
        // Hide the canvas and retake button, show the video and snap button
        $(".canvas-wrap").hide();
        $(".video-wrap").show();
        $("#video").show();
        $("#snap").show();
        $("#retake").hide();
        $("#next").hide();
    });
});
