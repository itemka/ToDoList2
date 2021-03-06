import React from 'react';
import css from './Login.module.css';
import {Field, reduxForm} from "redux-form";
import {createField, Input} from "../ReduxFormsControls/ReduxFormsControls";
import {maxLengthCreator, required} from "../../BLL/utils/validators/validators";
import {connect} from "react-redux";
import {getAuthUserIsAuthS} from "../../BLL/AuthSelectors";

const maxLength20 = maxLengthCreator(20);

const LoginForm = props => {
    return (
        <form onSubmit={props.handleSubmit}>
            {props.isAuth === true
                ? <button>Log out</button>
                : <div>
                    {createField(Input, [required, maxLength20], `Email`, `Email`, {className: css.input})}
                    {createField(Input, [required, maxLength20], `Password`, `Password`, {
                        type: `password`, className: css.input
                    })}
                    {createField(`input`, null, `Remember`, null, {type: `checkbox`}, `Remember me`)}
                </div>}
            {props.error && <div className={css.formError}>{props.error}</div>}
            <div>{props.isAuth ? <button>Log out</button> : <button className={css.button}>Log in</button>}</div>
        </form>
    )
};
const mapStateToProps = state => ({isAuth: getAuthUserIsAuthS(state)});
export default reduxForm({form: `login`})(connect(mapStateToProps, {})(LoginForm));