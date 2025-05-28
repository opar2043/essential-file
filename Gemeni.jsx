  const [qus, setQus] = useState("");
  const [ans, setAns] = useState("");

 async function handleChatBot(e) {
   e.preventDefault();
   setAns('Loading.......')
   const res = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAq8OKuujcz5YoEqXD0Z6G1f4dg0OX5FDY",
      method: "POST",
      data: {
        contents: [
          {
            parts: [
              {
                text: qus,
              },
            ],
          }
        ],
      },
    });


    // console.log(res?.data?.candidates[0]?.content.parts[0].text);
    setAns(res?.data?.candidates[0]?.content.parts[0].text);

    e.target.reset()
  }
