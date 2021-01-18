import React, { Component, PropTypes } from 'react';
import {Modal } from 'antd';
import {ReactModal} from 'react-modal'
import TitleBar from '../TitleBar';
import MediaTable from '../MediaTable';
import { FileViewer } from '../MediaViewers/FileViewer';
import FileUpload from './FileUpload';
import $ from 'jquery';
import './FileTable.scss';

export default class FileTable extends Component {

  static propTypes = {
    onNameEdit: PropTypes.func,
  };

  static ColumnModel = {
    resolution: {
      title: 'Résolution',
      key: 'resolution',
      render: (text, file) => `${file.width}x${file.height} (px)`,
    },
    weight: {
      title: 'Poids',
      key: 'weight',
      sorter: (a, b) => b.weight - a.weight,
      render: (text, file) => {
        if (file.weight < 1000) {
          return file.weight + ' o';
        }
        if (file.weight < 1000000) {
          return Number(file.weight / 1000).toFixed(2) + ' Ko';
        }
        if (file.weight < 1000000000) {
          return Number(file.weight / 1000000).toFixed(2) + ' Mo';
        }
        return Number(file.weight / 1000000000).toFixed(2) + ' Go';
      }
    },
    mimetype: {
      title: 'mimetype',
      dataIndex: 'mimetype',
      key: 'mimetype',
      sorter: (a, b) => b.mimetype.localeCompare(a.mimetype),
    }
  };

  constructor(props) {
    super(props);

    this.state = ({
      previewIsVisible: false,
      previewWidth: 0,
      previewFile: null,
      showModal: false
    });
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  handleOpenModal () {
    $("#modalView").show();
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  openFileUpload = () => {
    this.fileUpload.open();
  }

  openPreview = (file) => {
    const maxPreviewWidth = 768;
    const maxPreviewHeight = 432;

    // Calcul la largeur de la preview en fonction des dimensions du fichier et des dimensions maximales
    const widthRatio = file.width / maxPreviewWidth;
    const heightRatio = file.height / maxPreviewHeight;
    const largerRatio = widthRatio > heightRatio ? widthRatio : heightRatio;
    const previewWidth = largerRatio > 1 ? file.width / largerRatio : file.width;
    console.log("seck ");
   this.modalViewOpen();
    this.setState({
      previewIsVisible: true,
      previewWidth,
      previewFile: file
    });
  }

  closePreview = () => {
    this.setState({
      previewIsVisible: false
    });
  }

  removePreviewFile = () => {
    this.setState({
      previewFile: null
    });
  }
  modalViewClose() {
    $("#modalView").hide();
     this.closePreview();
    this.removePreviewFile(); 
    
  }
   modalViewOpen() {
    this.handleOpenModal();
   // alert("hello");
  }
  render() {

    const columns = [
      MediaTable.ColumnModel.id,
      MediaTable.ColumnModel.name(this.props.onNameEdit),
      FileTable.ColumnModel.resolution,
      FileTable.ColumnModel.weight,
      FileTable.ColumnModel.mimetype,
      MediaTable.ColumnModel.ratio,
      MediaTable.ColumnModel.createdAt,
    ];
    const { previewIsVisible, previewWidth, previewFile } = this.state;

    return (
      <div>
        
        <TitleBar title="Fichiers" />
        <FileUpload ref={(ref) => this.fileUpload = ref ? ref.getWrappedInstance() : null} onRefresh={this.props.onRefresh} />
        <MediaTable
          columns={columns} 
          dataSource={this.props.dataSource}
          onAdd={this.openFileUpload} 
          onPreview={this.openPreview} 
          {...this.props} 
         />
      
       {/*  <Modal
          visible={previewIsVisible}
          key={Date.now()}
          title={previewFile ? previewFile.name : null}
          footer={null}
          onCancel={this.closePreview}
          afterClose={this.removePreviewFile}
          width={previewWidth}>
          { previewFile && <FileViewer file={previewFile} width="auto" displayControls /> }
        </Modal>  */}
         <div className="modal modal-view" style={{display:"none"}} id="modalView" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        
                            <h4 className="modal-title">{previewFile ? previewFile.name : null}</h4>
                            <button type="button" onClick={this.modalViewClose} className="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        </div>
                        <div className="modal-body">
                            <div className="accordion accordionInfosClient accordion-custom" id="">
                            <div className="card">
                             <div className="card-body">
                             { previewFile && <FileViewer file={previewFile}  width="575px" height="400px" displayControls /> }
                                <div className="form-row">
                                       
                                </div>
                                
                             </div>
                            </div>
                           </div>
                        </div>
                        <div className="modal-footer">
                            </div>
                        </div>
                </div>
            </div>
      </div>
    );
  }
}
