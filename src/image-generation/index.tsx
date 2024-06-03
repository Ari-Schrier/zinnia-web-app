import React, { useState } from "react";
import { Carousel } from 'react-bootstrap';
import { generateImage, generatePrompts } from "./client";
import image01 from "../images/01.webp";
import image02 from "../images/02.webp";
import image03 from "../images/03.webp";

const ImageFactory: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [working, toggleWorking] = useState(false)
  const [title, setTitle] = useState("");
  const [generatedPrompts, setGeneratedPrompts] = useState<any>([]);
  const [images, changeImages] = useState<any>([]);
  const [activeIndex, setActiveIndex] = useState(0); // State to track the active carousel index

  const addImage = async (prompt: any, question: any) => {
    toggleWorking(true);
    const newURL = await generateImage(prompt);
    changeImages([...images, {image: newURL, prompt:prompt, question: question}]);
    setPrompt("");
    setActiveIndex(images.length);
    toggleWorking(false);
  };

  const getPrompts = async (title: any) => {
    toggleWorking(true);
    const response = await generatePrompts(title);
    setTitle("");
    console.log(response);
    setGeneratedPrompts(JSON.parse(response));
    toggleWorking(false);
  };

  const removeImage = () => {
    const updatedImages = images.filter((_: any, index: number) => index !== activeIndex);
    setActiveIndex(Math.min(activeIndex, updatedImages.length));
    changeImages(updatedImages);
  };

  const regenerateImage = async () => {
    toggleWorking(true);
    const newImage = await generateImage(images[activeIndex].prompt);
    const updatedImages = images.map((image:any, index:number) => index === activeIndex? {...image, image:newImage} : image);
    changeImages(updatedImages);
    toggleWorking(false);
  }

  return (
    <div>
      <div className="d-flex justify-content-center bg-primary text-white">
        <h1>ZTV Image Factory</h1>
      </div>

      {images.length >= 1 && (
        <div className="container">
          <Carousel activeIndex={activeIndex} onSelect={(index: any) => !working?setActiveIndex(index):{}} interval={null}>
            {images.map((source: any, index: number) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={source.image} alt="A Slide" />
              </Carousel.Item>
            ))}
          </Carousel>
          <h2>{images[activeIndex].question[0]}</h2>
          <h2>{images[activeIndex].question[2]}</h2>
          <button onClick={removeImage} disabled={working} className="btn btn-danger mt-3">Remove Current Image</button>
          <button onClick={regenerateImage} disabled={working} className="btn btn-success mt-3">Regenerate Current Image</button>
        </div>
      )}

      <div className="container d-flex justify-content-center">
        <div className="input-group">
          <span className="input-group-text">Direct Prompt:</span>
          <textarea
            className="form-control"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="If there's a specific prompt you want to try to generate, type it here."
          ></textarea>
          <button onClick={() => addImage(prompt, "No Question Provided")} disabled={working} className="btn btn-outline-secondary" type="button">Submit</button>
        </div>
      </div>

      <div className="container d-flex justify-content-center">
        <div className="input-group">
          <span className="input-group-text">Title:</span>
          <input
            type="text"
            className="form-control"
            value={title}
            placeholder="The title of the slideshow you're generating."
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <button onClick={() => getPrompts(title)} className="btn btn-outline-secondary" disabled={working} type="button">Generate Prompts</button>
        </div>
      </div>

      {generatedPrompts.length >= 1 && (
        <div className="container">
          <ul className="list-group">
            {generatedPrompts.map((prompt: any) => {
              return (
                <li className="list-group-item" key={prompt.title}>
                  <div className="input-group">
                    <button onClick={() => setPrompt(prompt.description + " " + prompt.lens)} className="btn btn-outline-primary" disabled={working} type="button">Edit</button>
                    <span className="form-control">{prompt.description}</span>
                    <button onClick={() => addImage(prompt.description + " " + prompt.lens, prompt.question)} className="btn btn-outline-secondary" disabled={working} type="button">Submit</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageFactory;