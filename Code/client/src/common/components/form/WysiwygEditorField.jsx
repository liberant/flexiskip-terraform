import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WysiwygEditorField extends Component {
  constructor(props) {
    super(props);
    const { input } = props;
    const html = input && input.value;
    const contentBlock = html ? htmlToDraft(html) : null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      this.state = {
        editorState: EditorState.createWithContent(contentState),
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }


    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }


  onEditorStateChange(editorState) {
    const { input } = this.props;
    input.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState,
    });
  }

  render() {
    const { editorState } = this.state;
    const {
      meta: { touched, error, warning },
      label, required,
      style,
      className = '',
    } = this.props;

    return (
      <div style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}>
        <label style={style.label}>
          {(required && label) ? `${label} *` : `${label}`}
        </label>
        <div
          className={className}
          style={{
            ...style.inputBox,
            padding: 20,
            minHeight: '300px',
          }}
        >
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div>
          {
            touched &&
            ((error && <span className="text-danger" style={{ ...style.error }}>{error}</span>) ||
              (warning && <span>{warning}</span>))
          }
        </div>
      </div >
    );
  }
}

WysiwygEditorField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  meta: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  className: PropTypes.string,
};

WysiwygEditorField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  disabled: false,
  style: {},
  className: '',
};

export default WysiwygEditorField;
