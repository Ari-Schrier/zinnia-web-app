import { useState } from "react";
import { generateJSON, generateImage } from "./client";

function ImageGeneratorMk2(){
    const [json, setJson] = useState<any>(null);
    {/* Working is used to prevent the user from spamming calls to the API */}
    const [working, setWorking] = useState(false);
    const [title, setTitle] = useState("");

    {/* Used to navigate between images */}
    const [activeIndex, setIndex] = useState(0);
    const advanceIndex = ()=>{activeIndex+1 >= json.length? setIndex(0):setIndex(activeIndex+1)}
    const regressIndex = ()=>{activeIndex === 0? setIndex(json.length-1):setIndex(activeIndex-1)}

    const handlePromptChange = (e:any) => {
        const newPrompt = e.target.value;
        setJson((prevJson: any) => {
            const updatedJson = [...prevJson];
            updatedJson[activeIndex].prompt = newPrompt;
            return updatedJson;
        });
    }

    const handleImageChange = (img:any) => {
        setJson((prevJson:any) => {
            const updatedJson = [...prevJson];
            updatedJson[activeIndex].source = img; 
            return updatedJson;
        });
    }

    const fetchJson = async () =>{
        setWorking(true);
        const response = await generateJSON(title);
        console.log(response);
        setJson(JSON.parse(response).map((each:any) =>({...each, source: `${process.env.PUBLIC_URL}/testImages/zbot.jpeg` })));
        setWorking(false);
    }

    const fetchImage = async () =>{
        setWorking(true);
        const response = await generateImage(json[activeIndex].prompt);
        handleImageChange(response)
        setWorking(false);
    }

    return(
        <>
        {/* Until a better name is given... */}
        <div className="row text-center bg-primary rounded">
            {!working && <h1 className="text-light">ZTV Proprietary Image Factory</h1>}
            {working && <h1 className="text-light"><span className="spinner-grow" /> Working...</h1>}
        </div>

        {/* The following block is used to get the title from the user. It will vanish once GPT provides us with a JSON */}
        {(!json && !working) && (
        <div className="input-group input-group-lg mb-3">
            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control" placeholder="Title of Slideshow"/>
            <div className="input-group-append">
                <button className="btn btn-lg btn-outline-secondary" onClick={()=>fetchJson()} type="button">Submit</button>
            </div>
        </div>)
        }
        {/* Now we display the JSON */}
        {json && (<>
            <div className="row">
            <img className="img-fluid" alt={json[activeIndex].id} src={json[activeIndex].source} />
            </div>
            <div className="row bg-primary rounded text-light">
                <div className="col-3">
                    <button className="btn btn-lg btn-outline-light float-end" disabled={working} onClick={()=>regressIndex()}>Previous</button>
                </div>
                <div className="col-6 text-center h3">
                    {json[activeIndex].title[0]}
                </div>
                <div className="col-3">
                    <button className="btn btn-lg btn-outline-light" disabled={working} onClick={()=>advanceIndex()}>Next</button>
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <span className="input-group-text">Prompt:</span>
                    <textarea value={json[activeIndex].prompt} 
                        onChange={handlePromptChange} 
                        className="form-control" 
                        aria-label="With textarea"></textarea>
                    <button className="btn btn-outline-secondary" disabled={working} onClick={()=>fetchImage()} type="button" id="button-addon2">(Re)Generate</button>
                </div>
            </div>
        </>)}
        </>
    );
}

export default ImageGeneratorMk2;
