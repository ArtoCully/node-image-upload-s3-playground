import { useEffect, useState } from 'react'
import axios from 'axios'

import './App.css'

async function postImage({image, description}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  const getAllFiles = async () => {
    const result = await axios.get('/images');
    console.log('result', result);
    return result;
  };

  useEffect(() => {
    getAllFiles()
      .then((result) => {
        const imagePaths = result.data.Contents
          .map(img => (`/images/${img.Key}`));

        console.log('imagePaths', imagePaths);
        setImages([...images, ...imagePaths]);
      });
  }, []);

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({image: file, description})
    console.log('result', result);
    setImages([...images, result.imagePath])
  }

  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      {console.log('images', images)}

      {images.map((image, id) => (
        <div key={id}>
          <img src={image}></img>
        </div>
      ))}

      <img src="/images/ac9e6df7e31a9fc724e1b2b1109e7fa2"></img>

    </div>
  );
}

export default App;
