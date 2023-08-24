load_dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
});

let submitter = document.getElementsByClassName("submitter")[0]
let importer = document.getElementById("files")

let before = document.getElementsByClassName("before")[0]
let after = document.getElementsByClassName("after")[0]

let errorMessage = document.getElementsByClassName("message")[0]

submitter.addEventListener("click", function() {

    if (importer.files.length === 0){
        errorMessage.textContent = "importer un fichier"
        message_dialog.showModal()
        errorMessage.style.backgroundColor = "red"
        return
    }
    const selectedFile = importer.files[0];
    const csrfToken = $('[name=csrfmiddlewaretoken]').val();

    if (selectedFile) {
        load_dialog.showModal()
        const formData = new FormData();
        formData.append("excel_file", selectedFile);
        formData.append("csrfmiddlewaretoken",csrfToken)

        fetch("/home/upload-excel/", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            load_dialog.close()
            errorMessage.textContent = data.message
            message_dialog.showModal()
            let color  = data.status === 1 ? "green" : "red"
            errorMessage.style.backgroundColor = color
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } else {
        alert("No file selected");
    }
});

importer.onchange = function (e){
    const selectedFile = importer.files[0];
    if (selectedFile) {
        before.style.display = "none"
        after.style.display = "block"
        document.getElementsByClassName("importedFilename")[0].textContent = selectedFile.name
    }
}
