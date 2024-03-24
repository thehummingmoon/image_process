document.getElementById('uploadButton').addEventListener('click', function() {
    var input = document.getElementById('imageInput');
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var mat = cv.imread(img); // Convert image to OpenCV Mat object

                // Load the pre-trained car detection model
                var carCascade = new cv.CascadeClassifier();
                carCascade.load('haarcascade_car.xml');

                // Detect cars in the image
                var cars = new cv.RectVector();
                var scaleFactor = 1.1;
                var minNeighbors = 2;
                var minSize = new cv.Size(30, 30);
                carCascade.detectMultiScale(mat, cars, scaleFactor, minNeighbors, 0, minSize);

                // Update the number of cars detected
                document.getElementById('numCars').innerText = cars.size();

                // Display the original image
                document.getElementById('originalImage').src = e.target.result;
                document.getElementById('originalImage').style.display = 'block';

                // Draw rectangles around detected cars on the processed canvas
                var processedCanvas = document.getElementById('processedCanvas');
                cv.imshow(processedCanvas, mat);
                processedCanvas.style.display = 'block';
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
});
