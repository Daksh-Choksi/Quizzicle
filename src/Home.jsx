import React, {useState} from "react";
import { motion } from "framer-motion";

let styles = {
  marginLeft: 370
}

export default function Home(props) {
  let displayQuestions = props.question.map((questions) => {
    let randomIndex = Math.floor(Math.random() * (30));
    let answer = questions.incorrectAnswers;
    answer.splice(randomIndex, 0, questions.correctAnswer);
    let unique = [];
    answer.every((element) => {
      if (!unique.includes(element)) {
        unique.push(element)
      }
      return true
    })



    let ans1 = unique.map((ans) => {
      let correctAnswerId;
      let ansId = Math.floor((Math.random(70) * 5 + 57.5) * (ans.length * ans.length))
      if (ans === questions.correctAnswer) {
         correctAnswerId = ansId
      }
      return (
        <motion.button className={`answerButton button${ansId}`} onClick={() => {
          props.check(ansId, correctAnswerId);
          props.choice(ansId);
          props.answerChoice(ansId, correctAnswerId);
        }} whileHover={{scale: 1.1}} transition={{type: "spring", bounce: 0.4, duration: 0.8}}>{ans}</motion.button>
      )

    })
    return (
      <motion.div 
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      transition={{type: "spring", duration: 4}}
      key={questions.id} className="container">
        <p className="questions">{questions.question.text}</p>
        {ans1}
      </motion.div>
    ) 
  });

  
  return (
    <div style={styles}>
      {displayQuestions}
    </div>
  )
}

