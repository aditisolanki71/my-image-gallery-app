import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


// SVG components
import BarChart from "../../assets/Charts/BarChart.svg";
import BarChart2 from "../../assets/Charts/BarChart2.svg";
import BarChart3 from "../../assets/Charts/BarChart3.svg";
import BarChart4 from "../../assets/Charts/BarChart4.svg";
import DoughnutChart from "../../assets/Charts/DoughnutChart.svg";
import DoughnutChart2 from "../../assets/Charts/DoughnutChart2.svg";
import LineChart from "../../assets/Charts/LineChart.svg";
import LineChart2 from "../../assets/Charts/LineChart2.svg";

import "./styles.css";

const images = [
  BarChart,
  BarChart2,
  BarChart3,
  BarChart4,
  DoughnutChart,
  DoughnutChart2,
  LineChart,
  LineChart2,
];

const DraggableImage = ({ image, index, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "image",
    hover: (item) => {
      if (item.index !== index) {
        console.log("hover: ", item.index, index);
        onDrop(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`image-container ${isDragging ? "dragging" : ""}`}
    >
      <img src={image} alt={`img-${index}`} className="image" />
    </div>
  );
};

const ImageGallery = () => {
  const [imageOrder, setImageOrder] = useState(getInitialImageOrder());

  useEffect(() => {
    localStorage.setItem("imageOrder", JSON.stringify(imageOrder));
  }, [imageOrder]);
  
  function getInitialImageOrder() {
    const storedOrder = localStorage.getItem("imageOrder");
    return storedOrder ? JSON.parse(storedOrder) : images;
  }

  const handleDrop = (dragIndex, hoverIndex) => {
    console.log("handleDrop: ", dragIndex, hoverIndex);
    const updatedOrder = Array.from(imageOrder);
    const [draggedImage] = updatedOrder.splice(dragIndex, 1);
    updatedOrder.splice(hoverIndex, 0, draggedImage);
    setImageOrder(updatedOrder);
  };

  const handleResetOrder = () => {
    const defaultOrder = [...images];
    setImageOrder(defaultOrder);
    localStorage.setItem("imageOrder", JSON.stringify(defaultOrder));
  };

  return (
    <>
      <div className="heading">Photo Gallery</div>
      <DndProvider backend={HTML5Backend}>
        <button onClick={handleResetOrder} className="resetButton">
          Reset Order
        </button>
        <div className="image-grid">
          {imageOrder.map((image, index) => (
            <DraggableImage
              key={index} // Use index as the key for DraggableImage
              image={image}
              index={index}
              onDrop={(dragIndex) => handleDrop(dragIndex, index)}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
};

export default ImageGallery;