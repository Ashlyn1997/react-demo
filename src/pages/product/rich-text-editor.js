import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) { //如果有值，根据html
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                }
            } else {
                this.state = {
                    editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
                }
            }
        }
    }

    state = {
        editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
    }

    //输入过程中实时输入内容的回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack = (file) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url //得到图片的url
                resolve({data: url});
            })
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
            })
        })
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        );
    }
}