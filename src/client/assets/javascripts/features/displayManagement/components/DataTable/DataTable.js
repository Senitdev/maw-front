import React, { Component, PropTypes } from 'react';
import { Table, Input, Button, Row, Col, Tooltip, Popconfirm } from 'antd';

import TitleBar from '../TitleBar';
import ActionsCell from './ActionsCell';

import './DataTable.scss';

export default class DataTable extends Component {

  static propTypes = {
    columns:  PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    onAdd: PropTypes.func,
    onCalendar: PropTypes.func,
    onCalendarSelection: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteSelection: PropTypes.func,
    onEdit: PropTypes.func,
    onGroupSelection: PropTypes.func,
    onPreview: PropTypes.func,
    onRefresh: PropTypes.func,
    onSchedule: PropTypes.func,
    onScheduleSelection: PropTypes.func,
    onSearch: PropTypes.func,
    title: PropTypes.string,
    
  };

  constructor(props) {
    super(props);

    this.state = {
      groupNameInputValue: '',
    };
  }

  render() {

    const { columns,
            loading,
            onAdd,
            onCalendar,
            onCalendarSelection,
            onDelete,
            onDeleteSelection,
            onEdit,
            onGroupSelection,
            onPreview,
            onRefresh,
            onSchedule,
            onScheduleSelection,
            onSearch,
            title,
            ...otherProps
          } = this.props;

    const tableColumns = (onCalendar || onDelete || onEdit || onPreview || onSchedule ?
      columns.concat({
        title: 'Actions',
        key: 'actions',
        width: 115,
        className: 'maw-data-table-actions-column',
        render: (text, record) => <ActionsCell onCalendar={onCalendar}
                                               onDelete={onDelete}
                                               onEdit={onEdit}
                                               onPreview={onPreview}
                                               onSchedule={onSchedule}
                                               record={record} />
      })
      :
      columns
    );

    return (
      <div className="maw-data-table">

        { /* Ligne du titre si nécessaire */ title &&
        <TitleBar title={title} />
        }

        { 
         (onRefresh || onGroupSelection || onDeleteSelection || onAdd || onSearch || onScheduleSelection || onCalendarSelection) && (
        <Row style={{marginBottom: '4px'}}>

          <Col span={4} className="maw-data-table-tool-bar">
            {  onRefresh &&
           // <Tooltip title="Rafraichir les données" placement="bottom" mouseEnterDelay={0.6}>
              <Button loading={loading} icon="reload"  title="Rafraichir les données" onClick={onRefresh} />
            //</Tooltip>
            }
            { onGroupSelection &&
          //  <Tooltip title="Groupe la sélection" placement="bottom" mouseEnterDelay={0.6}>
              <Button icon="usergroup-add" onClick={() => this.setState({groupPopoverVisible: true})} />
         //   </Tooltip>
            }
            {  onScheduleSelection &&
           // <Tooltip title="Editer les horraires d'activité" placement="bottom" mouseEnterDelay={0.6}>
              <Button icon="clock-circle-o" onClick={onScheduleSelection} />
          //  </Tooltip>
            }
            {  onCalendarSelection &&
            // <Tooltip title="Modifier l'agenda de la sélection" placement="bottom" mouseEnterDelay={0.6}>
              <Button icon="calendar" onClick={onCalendarSelection} />
            // </Tooltip>
            }
            {  onDeleteSelection &&
           // <Tooltip title="Supprimer la sélection" placement="bottom" mouseEnterDelay={0.6}>
             // <Popconfirm title="Supprimer la sélection ?" onConfirm={onDeleteSelection} okText="Oui" cancelText="Non">
                <Button icon="delete" onClick={onDeleteSelection}  title="Supprimer la sélection" />
             // </Popconfirm>
          //  </Tooltip>
            }
            {  onAdd &&
           // <Tooltip title="Ajouter" placement="bottom" mouseEnterDelay={0.6}>
              <Button title="Ajouter" type="primary" icon="plus" onClick={onAdd} />
            //</Tooltip>
            }
          </Col>

          <Col span={4}>
            {  onSearch &&
            <Input.Search placeholder="Rechercher" onSearch={onSearch} />
            }
          </Col>
        </Row>
        )}  

        { /* Ligne avec la table */ }
        <Row>
          <Col>
            <Table
             dataSource={this.props.dataSource}
              columns={tableColumns}
            // loading={loading}
              rowKey={(record) => record.id}
            //  rowSelection={this.props.rowSelection}
              //{...otherProps}
               />
          </Col>
        </Row>
      </div>
    );
  }
}
