import React, { Component, PropTypes } from 'react';
import { Button, Icon, Input, Tooltip } from 'antd';
import $ from 'jquery';
import { NotificationGenerator } from 'features/core/components/NotificationGenerator';
import './EditableCell.scss';

export default class EditableCell extends Component {

  static propTypes = {
    field: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      newValue: ''
    };
  }

  /**
   * Active l'édition de la valeur de la cellule.
   */
  startEditing = () => {
    this.setState({
      isEditing: true,
      newValue: this.props.record[this.props.field]
    });
  }

  /**
   * Callback au changement de valeur dans l'input de modification.
   */
  handleEditInputChange = (e) => {
    this.setState({ newValue: e.target.value });
  }

  /**
   * Callback à la validation de la modification.
   */
  validateEdit = () => {
    const { newValue } = this.state;
    const { field, record } = this.props;
    const newRecord = {
      ...record,
      [field]: newValue
    };
    /* var obj = JSON.parse($("#tableData").val());
    const filterTable = obj.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(newValue.toLowerCase())
      )
    );
    alert(JSON.parse(filterTable).length());  */
    var searchField = "name";
    var obj = JSON.parse($("#tableData").val());
    var cpt=0;
    for (var i=0 ; i < obj.length ; i++)
    {
        if (obj[i][searchField] == this.state.newValue) {
            cpt++;
        }
    } 
    if(cpt>=1)
    {
      NotificationGenerator.raise('Ce nom existe déjà, veuillez écrire un nouveau nom.',  'error');
    }
    else
    {
      this.props.onEdit(newRecord, field, newValue);
      this.setState({ isEditing: false });
    }
   
  }

  /**
   * Callback à l'annulation de la modification.
   */
  cancelEdit = () => {
    this.setState({ isEditing: false });
  }

  render() {

    const { field, record } = this.props;
    const { isEditing, newValue } = this.state;

    return (
      <div className="maw-editable-cell">
        <div className="button-box">
       { isEditing ? // Bouton "Modifier" ou "Annuler" en fonction de si modification en cours ou non
          // <Tooltip title="Annuler" mouseEnterDelay={0.5}>
            <Button icon="close" size="small" shape="circle" onClick={this.cancelEdit} />
          // </Tooltip>
          :
          // <Tooltip title="Modifier" mouseEnterDelay={0.5}>
            <Icon type="edit" className="edit-icon" onClick={this.startEditing} />
          // </Tooltip>
          }
          { isEditing && // Bouton "Enregistrer" si en cours de modification (visible si nouvelle valeur différente)
          // <Tooltip title="Enregistrer" mouseEnterDelay={0.5}>
            <Button type="primary" icon="check" size="small" shape="circle" onClick={this.validateEdit}
              style={{visibility: newValue == record[field] ? 'hidden' : 'visible' }}
            />
          // </Tooltip>
          } 
        </div>
        <div className="content">
          { isEditing ?
          <Input value={newValue} onChange={this.handleEditInputChange} onPressEnter={this.validateEdit} />
          :
          record[field]
          }
        </div>
      </div>
    );
  }
}
