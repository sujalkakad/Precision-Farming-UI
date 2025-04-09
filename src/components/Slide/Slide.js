import React, { useState, useEffect } from 'react';
import "./Slide.css";

function Slide() {
  const Slideshow = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const intervalTime = 2000;

    const slides = [
      "https://www.atlanticcouncil.org/wp-content/uploads/2020/09/An-Indian-farmer-in-a-field-scaled.jpg",
      "https://images.yourstory.com/cs/5/f02aced0d86311e98e0865c1f0fe59a2/indian-farmer-1610471656527.png",
      "https://cms.qz.com/wp-content/uploads/2018/01/india-farming1.jpg?quality=75&strip=all&w=410&h=230.625",
      "https://3.bp.blogspot.com/-nSmrnp_m5SQ/Vl0xoJ97v5I/AAAAAAAAAgU/CCuw8YFLOrM/s1600/Agriculture%2BIndustry%2Bin%2BIndia.jpg",
      "https://wallpapercave.com/wp/wp6592172.jpg",
      "https://static.theprint.in/wp-content/uploads/2018/05/1_Agriculture_and_rural_farms_of_India-e1548392979838.jpg",
      "https://c.pxhere.com/photos/af/b0/vineyard_wine_grape_niagara-669102.jpg!d",      
      "https://discuss.farmnest.com/uploads/default/original/2X/5/5821a23f68ba083816831d5171794eb21a5af276.jpg",
      "https://c.pxhere.com/photos/1f/f5/apple_tree_garden_green_fruit_season_summer_branch-688776.jpg!d"
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setSlideIndex((prevSlideIndex) =>
          prevSlideIndex === slides.length - 1 ? 0 : prevSlideIndex + 1
        );
      }, intervalTime);

      return () => clearInterval(interval);
    }, [slideIndex, slides.length]);

    const showSlides = (index) => {
      if (index >= slides.length) {
        setSlideIndex(0);
      } else if (index < 0) {
        setSlideIndex(slides.length - 1);
      } else {
        setSlideIndex(index);
      }
    };

    const plusSlides = (n) => {
      showSlides(slideIndex + n);
    };

    const minusSlides = (n) => {
      showSlides(slideIndex - n);
    };

    return (
      <div id="slideshow-container">
        <div className="slide">
          <img
            className="img1"
            src={slides[slideIndex]}
            alt={`Slide ${slideIndex + 1}`}
            style={{ width: "100%" }}
          />
        </div>

        <a id="prev" onClick={() => minusSlides(1)} className="prev"> &#10094; </a>
        <a id="next" onClick={() => plusSlides(1)} className="next">  &#10095; </a>
      </div>
    );
  };

  return (
    <div>
      <Slideshow />
    </div>
  );
}

export default Slide;

