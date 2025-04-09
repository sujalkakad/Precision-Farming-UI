import React from 'react'
import "./HowItWorks.css"
import HowItWorksImg from "../../assets/Untitled Diagram.drawio (1).png";


function HowItWorks() {
  return (
    <div className='howitworks'>
      <div><h2 className='title'> How it works </h2></div>
      
        <div className='intro'>            
      
            <div>                
                <img src={HowItWorksImg} className='transparent-image ' alt="How It Works"/>
            </div>

            <div className='process'>

                <h4>Farm Analysis Process</h4>
                
                <br/>

                <h6>User Input Farm Location</h6>
                <p>The process begins with the user entering the specific location of their farm. This information is crucial for tailoring the analysis to the local conditions.</p>

                <h6>Data Collection</h6>
                <p>The system collects relevant data from various APIs, including:</p>
                <ol className='bulleted'>
                    <li><strong>Weather Data:</strong> Information on temperature, precipitation, humidity, etc.</li>
                    <li><strong>Soil Data:</strong> Details about soil type, pH, nutrient levels, etc.</li>
                    <li><strong>Elevation Data:</strong> Geographic elevation which can affect climate and crop growth.</li>
                </ol>

                <h6>Data Processing</h6>
                <p>The collected data undergoes cleaning and preprocessing to ensure accuracy and consistency. This step may involve:</p>
                <ol className='bulleted'>
                    <li>Removing duplicates or irrelevant data.</li>
                    <li>Normalizing data formats.</li>
                    <li>Handling missing values.</li>
                </ol>

                <h6>Machine Learning Analysis</h6>
                <p>The processed data is analyzed using machine learning algorithms to predict:</p>
                <ol className='bulleted'>
                    <li>Suitable crops for the given location.</li>
                    <li>Potential diseases that may affect the crops based on environmental conditions.</li>
                </ol>

                <h6>Generate Recommendations</h6>
                <p>Based on the analysis, the system generates actionable recommendations for the user. This may include:</p>
                <ol className='bulleted'>
                    <li>Suggested crops to plant.</li>
                    <li>Best practices for disease prevention.</li>
                    <li>Optimal planting times.</li>
                </ol>

                <h6>User Receives Insights</h6>
                <p>Finally, the user receives insights and recommendations, enabling them to make informed decisions about their farming practices.</p>

            </div>
        </div>
    </div>
  )
}

export default HowItWorks
