import React from "react";
import { Field, reduxForm } from "redux-form";
import InputPasswordField from "../../common/components/form/InputPasswordField";
import { required } from "../../common/components/form/reduxFormComponents";
import SubmitButton from "../../common/components/form/SubmitButton";
import SingleMainBox from "../../common/components/SingleMainBox";
import { MAIN_COLOR } from "../../common/constants/styles";
import PropTypes from "prop-types";

const Styles = {
    outerBox: {
        marginBottom: 10,
        paddingLeft: 0,
    },
    input: {
        backgroundColor: "transparent",
        boxShadow: "0 0 0",
        color: "black",
        fontSize: 14,
    },
    inputBox: {
        backgroundColor: "#F6F6F6",
        borderRadius: "3px",
        height: 52,
        paddingTop: 7,
    },
    icon: {
        color: MAIN_COLOR,
        lineHeight: "35px",
        fontSize: 20,
    },
    label: {
        display: "none",
    },
};

const FormPassword = ({ handleSubmit, submitting }) => {
    return (
        <div>
            <SingleMainBox>
                <SingleMainBox.Content>
                    <form
                        onSubmit={handleSubmit}
                        style={{ margin: "auto", width: 360 }}
                    >
                        <div className="text-center">
                            <span
                                style={{
                                    fontSize: 28,
                                    color: "#666666",
                                    display: "inline-block",
                                    margin: "50px auto",
                                }}
                            >
                                Enter your runsheet password
                            </span>
                        </div>
                        <div className="text-left">
                            <Field
                                name="password"
                                component={InputPasswordField}
                                type="password"
                                placeholder="Password"
                                icon
                                style={Styles}
                                label=""
                                validate={[required]}
                                showRules={false}
                            >
                                <span className="handel-lock" />
                            </Field>
                        </div>
                        <div>
                            <SubmitButton
                                type="submit"
                                className="btn btn-default submit"
                                submitting={submitting}
                                submitLabel="Loading..."
                                style={{
                                    width: "100%",
                                    backgroundColor: MAIN_COLOR,
                                    fontWeight: "600",
                                    color: "#FFFFFF",
                                    height: "52px",
                                    borderRadius: 3,
                                }}
                            >
                                SUBMIT
                            </SubmitButton>
                        </div>
                    </form>
                </SingleMainBox.Content>
            </SingleMainBox>
        </div>
    );
};

FormPassword.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: "adminLogins",
})(FormPassword);
