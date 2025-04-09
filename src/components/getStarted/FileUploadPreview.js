// // FileUploadPreview.js
// import React, { Component } from "react";
// import '../getStarted/css/FileUploadPreview.css';

// class FileUploadPreview extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             selectedFiles: []
//         };

//         this.fileInputRef = React.createRef();
//     }

//     // Handles file selection from input element
//     handleFileChange = (event) => {
//         // Converts the FileList object to an array of files
//         const files = Array.from(event.target.files);
//         // Initializes an empty array to store file URLs and metadata
//         const fileURLs = [];
//         console.log(files); // Logs the selected files for debugging
//         console.log(fileURLs); // Logs the fileURLs array for debugging

//         // Loops through each selected file and creates a URL for it
//         files.forEach((file) => {
//             // Creates a temporary URL for the file object
//             const url = URL.createObjectURL(file);
//             // Pushes an object containing the file's name, type, and the created URL to the fileURLs array
//             fileURLs.push({ name: file.name, type: file.type, url: url });
//         });

//         // Updates the component's state with the newly selected files
//         this.setState({ selectedFiles: fileURLs });
//     };

//     // Handles the removal of a selected file
//     removeFile = (index) => {
//         // Destructures the selectedFiles from the state
//         const { selectedFiles } = this.state;
//         // Filters out the file at the specified index, creating a new array without it
//         const updatedFiles = selectedFiles.filter((_, i) => i !== index);

//         // Revokes the temporary URL associated with the removed file to free up memory
//         URL.revokeObjectURL(selectedFiles[index].url);

//         // Updates the state with the new list of selected files
//         this.setState({ selectedFiles: updatedFiles }, () => {
//             // Checks if there are no files left in the updated list
//             if (updatedFiles.length === 0) {
//                 // Resets the file input value if no files remain
//                 this.fileInputRef.current.value = null;
//             }
//         });
//     };


//     resetFileUpload = () => {
//         this.setState({ selectedFiles: [] }, () => {
//             if (this.fileInputRef.current) {
//                 this.fileInputRef.current.value = null; // Reset file input
//             }
//         });
//     };    


//     render() {
//         const { selectedFiles } = this.state;
//         const filesPerRow = 2;
//         const rows = [];
//         for (let i = 0; i < selectedFiles.length; i += filesPerRow) {
//             rows.push(
//                 <div key={i} className="file-row">
//                     {selectedFiles.slice(i, i + filesPerRow).map((file, index) => (
//                         <div key={index} className="file-box">
//                             <a
//                                 href={file.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="file-name"
//                                 aria-label={`Open ${file.name} in new tab`}
//                             >
//                                 {file.name}
//                             </a>
//                             <button
//                                 className="remove-btn"
//                                 onClick={() => this.removeFile(i + index)}
//                                 aria-label={`Remove ${file.name}`}
//                             >
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             );
//         }

//         return (
//             <div>
//                 <label htmlFor="files">Select File: </label>
//                 <input
//                     className="file-upload"
//                     type="file"
//                     id="files"
//                     multiple
//                     onChange={this.handleFileChange}
//                     ref={this.fileInputRef}
//                     accept=".jpg,.jpeg,.png,.pdf"
//                     aria-label="Upload files"
//                 />

//                 <div className="file-preview-container">
//                     {selectedFiles.length > 0 && (
//                         <div>
//                             <h4>Uploaded Files:</h4>
//                             {rows}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     }
// }

// export default FileUploadPreview;







// FileUploadPreview.js
import React, { Component } from "react";
import "../getStarted/css/FileUploadPreview.css";

class FileUploadPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: []
        };

        this.fileInputRef = React.createRef();
    }

    // Handles file selection from input element
    handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const fileURLs = files.map((file) => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file)
        }));

        this.setState({ selectedFiles: fileURLs });
    };

    // Handles the removal of a selected file
    removeFile = (index) => {
        this.setState((prevState) => {
            const updatedFiles = prevState.selectedFiles.filter((_, i) => i !== index);

            // Revoke object URL to free memory
            URL.revokeObjectURL(prevState.selectedFiles[index].url);

            return { selectedFiles: updatedFiles };
        }, () => {
            // Reset file input if no files remain
            if (this.state.selectedFiles.length === 0 && this.fileInputRef.current) {
                this.fileInputRef.current.value = null;
            }
        });
    };

    // Resets file selection
    // resetFileUpload = () => {
    //     this.setState({ selectedFiles: [] }, () => {
    //         if (this.fileInputRef.current) {
    //             this.fileInputRef.current.value = "";
    //         }
    //     });
    // };

    render() {
        const { selectedFiles } = this.state;

        return (
            <div>
                <label htmlFor="files">Select File: </label>
                <input
                    className="file-upload"
                    type="file"
                    id="files"
                    multiple
                    onChange={this.handleFileChange}
                    ref={this.fileInputRef}
                    accept=".jpg,.jpeg,.png,.pdf"
                    aria-label="Upload files"
                />

                <div className="file-preview-container">
                    {selectedFiles.length > 0 && (
                        <div>
                            <h4>Uploaded Files:</h4>
                            <div className="file-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={file.name + index} className="file-box">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-name"
                                            aria-label={`Open ${file.name} in new tab`}
                                        >
                                            {file.name}
                                        </a>
                                        <button
                                            className="remove-btn"
                                            onClick={() => this.removeFile(index)}
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default FileUploadPreview;

