import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './answerButton.scss'
import './select.scss'
import Home from './Home'
import Quizzicle from './Quizzicle.png'
import Confetti from 'react-confetti'
import { useScroll, motion, useSpring, useTransform, useCycle } from "framer-motion"



export default function App() {

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress);

  const background = useTransform(scrollYProgress, 
  [0, 1],
  ["rgb(86, 1, 245)", "rgb(1, 245, 13)"]
  )


  let [questions, setQuestions] = useState([])
  let [selection, setSelection] = useState({
    answer: [], correctAnswer: [], toggle: false, hold: true
  })

  function check(id, correctId) {
    let check = document.querySelector(`.button${id}`)
    if (selection.toggle) {
      if (id === correctId && check) {
        check.style.backgroundColor = "green"
      }
      else if (id !== correctId && check) {
        check.style.backgroundColor = "red"
      }
    }
  }

   function compareAnswers() {
    if (selection.toggle === false) {
      setSelection((prevSelection) => {
        return {
          ...prevSelection,
          toggle: true
        }
      })
    }
    else if (selection.toggle === true) {
      setSelection((prevSelection) => {
        return {
          ...prevSelection,
          toggle: false
        }
      })
    }
  }

  let score = 0;

  function start() {
      fetch("https://the-trivia-api.com/v2/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      score = 0;
      setSelection(prevSelection => {
        return {
          ...prevSelection,
          answer: [],
          correctAnswer: []
        }
      })
  }

  function Score() {
    for (let i = 0; i < selection.answer.length; i++) {
      if (selection.answer[i] === selection.correctAnswer[i]) {
        score += 1
      }
      else {
        continue
      }
    }
    return score
  }


  function answerChoice(id, correctId) {
    setSelection((prevSelection) => {
      return {
        ...prevSelection,
        answer: [...selection.answer, id],
        correctAnswer: [...selection.correctAnswer, correctId]
      }
    })
  }


  function choice(id) {
    let choice = document.querySelector(`.button${id}`)
    if (!selection.toggle) {
      if (selection.hold) {
      choice.style.backgroundColor = "black"
      choice.style.color = "white"
      }
      else if (!selection.hold) {
        choice.style.backgroundColor = '#0f2862'
        choice.style.color = '#00DDFF'
      }
    }
  }


  function click() {
    let otherButtons = document.querySelectorAll('.answerButton')
    otherButtons.forEach((button) => {
      button.click();
    })
  }

  
  return (
    <div>
      {questions.length > 0
      ?
      <div>
        <motion.div
          style={{
            scaleX,
            transformOrigin: "left",
            background,
            position: "sticky",
            top: 0,
            width: "100%",
            height: "5px",
          }}
        />
        <Home
          question={questions}
          answerChoice={answerChoice}
          selection={selection}
          choice={choice}
          check={check}
        />
        {
          !selection.toggle
          ?
            <button className="Submit" onClick={() => {
              compareAnswers();
              Score();
            }}>Submit</button>
          :
          <div>
            <Confetti
            height={4030}
            />
            <p className='scoredisplay'>You scored {Score()}/10, Well done!</p>
            <button className='revealButton' onClick={click}>Reveal Answers</button>
            <button onClick={() => {
              start();
              compareAnswers();
            }} className='playAgain'>Play Again</button>
          </div>
          }
      </div>
      :
      <div> 
        <img src={Quizzicle} className='homeImg'></img>
        <motion.button 
        className="button" onClick={() => {
          start()
          }} drag dragConstraints={{left: -30, right: 30, bottom: 30}} 
          dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
          initial={{scale: 0}}
          whileInView={{scale: 1.2, borderWidth: 2, borderStyle: 'solid'}}
          transition={{durarion: 2, ease: "easeOut", type: "spring"}}
          >Start Quiz</motion.button>
      </div>}
    </div>
  )
}
