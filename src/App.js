import "./App.css";
import { useState, useEffect, useCallback } from "react";

import {
  ImSearch,
  ImHome3,
  ImFeed,
  ImCalendar,
  ImUser,
  ImBoxRemove,
  ImEnter,
} from "react-icons/im";



function Modal({title, overview}){
  return(
    <div className="App-modal" id="modal">
      <h3>{title}</h3>
      <p>{overview}</p>
    </div>
    );
}
function App() {
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState("App-sidebar");
  const [userText, setUserText] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [titleActive, setTitleActive] = useState("");
  const [overviewActive, setOverviewActive] = useState("");
  const [start, setStart] = useState(0);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const num = Array.from(Array(10)).map((e, i) => i);
  const keyMovie = "45c857b10f1d7b5f1b33127149d88893";
  const url_movie ="https://api.themoviedb.org/3/search/movie?api_key=" +keyMovie +"&language=pt-BR&query=";

  const logKey = useCallback(
    async (e) => {
      let indexN = e.target.tabIndex;
      const boxElement = document.getElementById("trilho");

      const openShow = () => {
        if (open === true) return false;
        setOpen(true);
        setOpenS("App-sidebar App-sidebar-active");
      };

      const closeShow = () => {
        if (open === false) return false;
        setOpen(false);
        setOpenS("App-sidebar");
      };
      const startGo = () => {
        if (start === 0) {
          document.getElementById("t5").focus();
          setStart(1);
        }
      };

      const overlayShow = () => {
          document.getElementById("overlay").style.display="block";
      };
      const overlayHide = () => {
          document.getElementById("overlay").style.display="none";
      };

      const focar = (id)=>{
        document.getElementById(id).focus();
      };
      startGo();
      
      if (
        indexN > 41 &&
        (e.code === "ArrowLeft" || e.code === "ArrowRight")
      ) {
        let multi = 0;
        if (e.code === "ArrowLeft") {
          multi = indexN - 44;
        } else {
          multi = indexN - 42;
        }
        const newLeft = 254 * multi;
        boxElement.style.marginLeft = "-" + newLeft + "px";
      }

      /////Teclado
      if (e.keyCode === 32 || (e.keyCode >= 65 && e.keyCode <= 90)) {
        closeShow();
        setUserText((prevUserText) => `${prevUserText}${e.key}`);
        focar("t" + indexN);
      }

      //////Enter
      if (e.key === "Enter") {
        if (indexN === 41) {
          setUserText("");
          setItems([]);
          setIsLoaded(false);
        }
        if (indexN === 42) {
          setUserText(
              (prevUserText) => `${prevUserText} `
            );
          focar("t" + indexN);
        }
        if (e.keyCode === 13) {
          if (indexN >= 5 && indexN < 41) {
            closeShow();
            setUserText(
              (prevUserText) => `${prevUserText}${e.target.innerHTML}`
            );
            focar("t" + indexN);
          }
        }
        if(indexN > 42){
          setTitleActive(e.target.dataset.title);
          setOverviewActive(e.target.dataset.overview);
          focar("t" + indexN);
        }
      }

      /////Up
      if (e.code === "ArrowUp") {
        if (indexN === 5) {
          await focar("t4");
          closeShow();
        } else if (indexN <= 5) {
          await focar("t" + (indexN - 1));
          openShow();
        } else {
          await focar("t" + (indexN - 6));
          closeShow();
        }
      }
      /////Down
      if (e.code === "ArrowDown") {
        if (indexN === 4) {
          closeShow();
          focar("t5");
        }
        if ([35, 36, 37].indexOf(indexN) + 1) {
          focar("t41");
        }else if ([38, 39, 40].indexOf(indexN) + 1) {
          focar("t42");
        }
        else if (indexN < 5) {
          focar("t" + (indexN + 1));
          openShow();
        } else {
          closeShow();
          focar("t" + (indexN + 6));
        }
      }
      /////Right
      if (e.code === "ArrowRight") {
        
        if (indexN < 5) {
          document.getElementById("t1").classList.add("active")
          focar("t5");
          closeShow();
        }else if ([10, 16, 22, 28, 34, 40  ].indexOf(indexN) + 1) {
          focar("t43");
          overlayHide();
        } else {
          if(indexN >= 42){overlayHide();}else{overlayShow();}
          focar("t" + (indexN + 1));
          closeShow();
        }
      }

      if (e.code === "ArrowLeft") {
        if ([5, 11, 17, 23, 29, 35, 41].indexOf(indexN) + 1) {
          document.getElementById("t1").classList.remove("active")
          focar("t1");
          setOpen(true);
          setOpenS("App-sidebar App-sidebar-active");
        } else {
          if(indexN < 42){overlayShow();}else{overlayHide();}
          focar("t" + (indexN - 1));
        }
      }
    },
    [ open, start]
  );

  const handleFocusEvent = (e) => {
    console.log(e.target.tabIndex);
  };

  let letras = alphabet.map((item, i) => {
    let tabI = i + 5;
    return (
      <div className="App-letras" key={i} value={item}>
        <span tabIndex={tabI} id={`t` + tabI} onBlur={handleFocusEvent}>
          {item}
        </span>
      </div>
    );
  });

  let numeros = num.map((item, i) => {
    let tabI = i + 31;
    return (
      <div className="App-letras" key={i} value={item}>
        <span
          href="false"
          tabIndex={tabI}
          id={`t` + tabI}
          onBlur={handleFocusEvent}
        >
          {item}
        </span>
      </div>
    );
  });



  useEffect(() => {

    const buscar = () => {
      setUserSearch(userText);
      fetch(url_movie + userText)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result.results);
          },
          (error) => {
            setIsLoaded(false);
            setError(error);
          }
        );
    };

    if (userText.length > 2 && userText !== userSearch) {
      buscar();
    }
    window.addEventListener("keydown", logKey);
    return () => {
      window.removeEventListener("keydown", logKey);
    };
  }, [logKey, userSearch, userText, url_movie]);

  return (
    <div className="App">
      
      <div className={openS}>
        <ul className="">
          <li>
            <a
              href="false"
              className=""
              id="t0"
              tabIndex="0"
              onBlur={handleFocusEvent}
            >
              <ImHome3 /> <span>Início</span>
            </a>
          </li>
          <li>
            <a
              href="false"
              className=""
              id="t1"
              tabIndex="1"
              onBlur={handleFocusEvent}
            >
              <ImSearch /> <span>Busca</span>
            </a>
          </li>
          <li>
            <a
              href="false"
              className=""
              id="t2"
              tabIndex="2"
              onBlur={handleFocusEvent}
            >
              <ImFeed /> <span>Agora na TV</span>
            </a>
          </li>
          <li>
            <a
              href="false"
              className=""
              id="t3"
              tabIndex="3"
              onBlur={handleFocusEvent}
            >
              <ImCalendar /> <span>Categorias</span>
            </a>
          </li>
          <li>
            <a
              href="false"
              className=""
              id="t4"
              tabIndex="4"
              onBlur={handleFocusEvent}
            >
              <ImUser /> <span>Minha Conta</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="App-main">
        <div className="App-col1">
          <div>
            <h1>Busca</h1>
          </div>

          <div>
            <div className="App-input">{userText}</div>

            <div className="App-content">
              {letras}
              {numeros}
              <div className="App-letras2" key={41}>
                <span
                  href="false"
                  tabIndex={41}
                  id={`t41`}
                  onBlur={handleFocusEvent}
                >
                  <ImBoxRemove /> Apagar
                </span>
              </div>
              <div className="App-letras2" key={42}>
                <span
                  href="false"
                  tabIndex={42}
                  id={`t42`}
                  onBlur={handleFocusEvent}
                >
                  <ImEnter /> Espaço
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="App-col2">
          <div id="overlay" className="overlay">
          </div>
          <div>
            {!isLoaded ? (
              <>
              <div>Comece a digitar para visulizar sua busca.</div>
              <div>{error}</div>
              </>
            ) : (
              <>
                <div className="App-card">
                  <div id="trilho" className="App-trilho">
                    {items.map((item, i) => (
                      <div
                        key={item.id}
                        tabIndex={i + 43}
                        id={`t` + (i + 43)}
                        onBlur={handleFocusEvent}
                        className="App-cardMovie"
                        data-title={item.title}
                        data-overview={item.overview}
                      >
                        {item.poster_path ? (
                          <img
                            className="AppMovie-image"
                            src={
                              `https://image.tmdb.org/t/p/w500/` +
                              item.poster_path
                            }
                            alt=""
                          />
                        ) : (
                          <div>sem image</div>
                        )}
                        <div className="AppMovie-text">{item.title}</div>
                      </div>
                    ))}
                  </div>
                    <Modal title={titleActive}  overview={overviewActive} />
                </div>
                
              </>
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default App;
