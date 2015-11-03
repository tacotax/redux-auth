import React, { PropTypes } from "react";
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { updatePassword, updatePasswordFormUpdate } from "../../actions/update-password";
import { connect } from "react-redux";

@connect(({auth}) => ({auth}))
class UpdatePasswordForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    inputProps: PropTypes.shape({
      password: PropTypes.object,
      passwordConfirmation: PropTypes.object,
      submit: PropTypes.object
    })
  }

  static defaultProps = {
    inputProps: {
      password: {},
      passwordConfirmation: {},
      submit: {}
    }
  }

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(updatePasswordFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit () {
    let formData = this.props.auth.getIn(["updatePassword", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(updatePassword(formData, this.getEndpoint()));
  }

  render () {
    let loading = this.props.auth.getIn(["updatePassword", this.getEndpoint(), "loading"]);
    let disabled = (
      !this.props.auth.getIn(["user", "isSignedIn"]) || loading ||
      (this.props.auth.getIn(["user", "attributes", "provider"]) !== "email")
    );

    return (
      <form
        className="redux-auth update-password-form clearfix"
        onSubmit={this.handleSubmit.bind(this)}>
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          disabled={disabled}
          className="update-password-password"
          value={this.props.auth.getIn(["updatePassword", this.getEndpoint(), "form", "password"])}
          errors={this.props.auth.getIn(["updatePassword", this.getEndpoint(), "errors", "password"])}
          onChange={this.handleInput.bind(this, "password")}
          {...this.props.inputProps.password} />

        <Input
          type="password"
          label="Password Confirmation"
          placeholder="Password Confirmation"
          className="update-password-password-confirmation"
          disabled={disabled}
          value={this.props.auth.getIn(["updatePassword", this.getEndpoint(), "form", "password_confirmation"])}
          errors={this.props.auth.getIn(["updatePassword", this.getEndpoint(), "errors", "password_confirmation"])}
          onChange={this.handleInput.bind(this, "password_confirmation")}
          {...this.props.inputProps.passwordConfirmation} />

        <ButtonLoader
          loading={loading}
          type="submit"
          className="pull-right update-password-submit"
          icon={this.props.icon}
          disabled={disabled}
          onClick={this.handleSubmit.bind(this)}
          {...this.props.inputProps.submit}>
          Update Password
        </ButtonLoader>
      </form>
    );
  }
}

export default UpdatePasswordForm;