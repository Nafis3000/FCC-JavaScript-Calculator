import styles from '../styles/Calculator.module.css'
import { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import React from 'react'

export const ACTIONS = { 
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CALCULATE: 'calculate',
    CLEAR: 'clear',
    DELETE: 'delete'
}


function reducer(state, {type, payload}){
    switch(type){
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            if (payload.digit === '0' && state.currentOperand === '0') {
                return state
            }
            if (payload.digit === '.' && state.currentOperand.includes('.')) {
                return state
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }             
        
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand === null && state.previousOperand === null) {
                return state
            }

            if (state.currentOperand === null && state.previousOperand !== null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            if (state.previousOperand == null){
                return {      
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null,
            }
        
        case ACTIONS.CLEAR: 
            return {}

        case ACTIONS.DELETE:
            if (state.overwrite){
            return {
                ...state,
                overwrite: false,
                currentOperand: null
            }
        }
        if(state.currentOperand === null) {
            return state
        }
        if (state.currentOperand.length === 1){
            return {
                ...state,
                currentOperand: null
            }
        }

        return {
            ...state,
            currentOperand: state.currentOperand.slice(0, -1)
        }


        case ACTIONS.CALCULATE:
            if (state.currentOperand === null || state.previousOperand === null || state.operation === null) {
                return state
            }
            return {
                ...state,
                previousOperand: null,
                currentOperand: evaluate(state),
                operation: null,
                overwrite: true,
            }
        
    }
}

function evaluate({previousOperand, currentOperand, operation}){
    const prev = parseFloat(previousOperand)
    const curr = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(curr)) return ''
    let computation = ''
    switch(operation){
        case '+':
            computation = prev + curr
            break
        case '-':
            computation = prev - curr
            break
        case '*':
            computation = prev * curr
            break
        case '÷':
            computation = prev / curr
            break
    }
    return computation.toString()
}

const INTEGER_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

function formatOperand(operand){
    if (operand == null) return 
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMAT.format(integer)
    return `${INTEGER_FORMAT.format(integer)}.${decimal}`
}

function Calculator(){
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})   
    
    return (
        <div className={styles.calculator}>
            <div className={styles.output} id="display">
                <div className={styles.previousOperand}>{formatOperand(previousOperand)} {operation}</div>
                <div className={styles.currentOperand}>{formatOperand(currentOperand)}</div>
            </div>
            <button id="clear" className={styles.spantwo} onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
            <button onClick={() => dispatch({type: ACTIONS.DELETE})}>DEL</button>
            <OperationButton operation="÷" dispatch={dispatch} id="divide" />
            <DigitButton digit='1' dispatch={dispatch} id="one" />
            <DigitButton digit='2' dispatch={dispatch} id="two"/>
            <DigitButton digit='3' dispatch={dispatch} id="three"/>
            <OperationButton operation="*" dispatch={dispatch} id="multiply" />
            <DigitButton digit='4' dispatch={dispatch} id="four"/>
            <DigitButton digit='5' dispatch={dispatch} id="five"/>
            <DigitButton digit='6' dispatch={dispatch} id="six"/>
            <OperationButton operation="+" dispatch={dispatch} id="add"/>
            <DigitButton digit='7' dispatch={dispatch} id="seven"/>
            <DigitButton digit='8' dispatch={dispatch} id="eight" />
            <DigitButton digit='9' dispatch={dispatch} id="nine"/>
            <OperationButton operation="-" dispatch={dispatch} id="substract" />
            <DigitButton digit='.' dispatch={dispatch} id="decimal"/>
            <DigitButton digit='0' dispatch={dispatch} id="zero"/>
            <button id="equals" className={styles.spantwo} onClick={() => dispatch({type:ACTIONS.CALCULATE})}>=</button>
        </div>
    ) 
}

export default Calculator