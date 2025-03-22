import axios from "axios";

const SubmitExcelData = ({ excelData }) => {
  const handleSubmit = async () => {
    try {
      // await axios.post("https://your-api-endpoint.com/upload", { data: excelData });
      // alert("Data submitted successfully!");
      console.log("Data: ", excelData)
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  return <button onClick={handleSubmit}>Submit to API</button>;
};

export default SubmitExcelData;
