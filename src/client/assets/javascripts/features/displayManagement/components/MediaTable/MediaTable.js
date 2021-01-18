import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import DataTable, { EditableCell } from '../DataTable';

export default class MediaTable extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
    onNameEdit: PropTypes.func,
    onSearch: PropTypes.func,
    displayManagement: PropTypes.object,
  };

  /**
   * Collection de modèle de colonne représentant les champs des media.
   * Un modèle peu être un objet définissant la colonne ou une fonction factory
   * qui construit l'objet en fonction de certains paramètres.
   */
  static ColumnModel = {
    // Modèle pour le champ "id"
    id: {
      title: <input  onClick={this.selectAll} id="selectall" type="checkbox"  />,
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => b.id - a.id,
      render: (text, media) =><input className="ads_Checkbox"   value={media.id}  type="checkbox"  />

    },
    // Modèle pour le champ "name". La factory prend en paramètre un callback si
    // l'on souhaite que le champ soit modifiable.
    name: (onEdit = null) => {
      const render = onEdit ?
        (text, media) => <EditableCell record={media}  field="name" onEdit={onEdit} />
        :
        (text, media) => media.name
      ;
      return {
        title: 'Nom',
        dataIndex: 'name',
        key: 'name',
        width: 350,
        searchable: true,
        sorter: (a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'accent' }),
        render
      };
    },
    // Modèle pour le champ "ratio"
    ratio: {
      title: 'Ratio',
      key: 'ratio',
      render: (text, media) => `${media.ratioNumerator} / ${media.ratioDenominator}`
    },
    // Modèle pour le champ "duration"
    duration: {
      title: 'Durée',
      key: 'duration',
      sorter: (a, b) => b.duration - a.duration,
      render: (text, media) => {
        if (!media.duration) {
          return '-';
        }
        const durationinSec = Math.floor(media.duration / 1000);
        const durationInMin = Math.floor(durationinSec / 60);
        const durationInHour = Math.floor(durationInMin / 60);
        const segments = {
          h: durationInHour,
          m: durationInMin % 60,
          s: durationinSec % 60
        };
        return (segments.h ? segments.h + 'h ' : '')
          + (segments.m || segments.h ? segments.m + 'm ' : '')
          + segments.s + 's';
      }
    },
    // Modèle pour le champ "createdAt"
    createdAt: {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => b.createdAt - a.createdAt,
      render: (text, media) => new Date(media.createdAt).toLocaleString('fr')
    },
    // Modèle pour le champ "updatedAt"
    updatedAt: {
      title: 'Dernière mise à jour',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => b.updatedAt - a.updatedAt,
      render: (text, media) => new Date(media.updatedAt).toLocaleString('fr')
    },
  };

  /**
   * Retourne les champs dont la valeur peut être recherchée.
   */
  static getSearchableFields(columns) {
    return columns.map((column) => {
      if(column.searchable) {
        return column.dataIndex;
      }
      return false;
    })
    .filter((val) => !!val);
  }

  /**
   * Constructeur.
   */
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      filterTable: null,
      searchableFields: MediaTable.getSearchableFields(props.columns)
    };
    this.selectAll = this.selectAll.bind(this);
    
  }
  componentDidMount()
  {
    $('#selectall').click(function() {
      if (!$(this).is(':checked')) {
      
        $('.ads_Checkbox').prop('checked', false);
      }
      else
      {
        $('.ads_Checkbox').prop('checked', true);
      }
    });
   
  }
  selectAll()
  {
    alert("seck");
 //   $('.ads_Checkbox').prop('checked', true);  
  }
  componentWillReceiveProps(nextProps) {

    // Si les collonnes changent, cherche à nouveau les champs "searchable"
    if (nextProps.columns != this.props.columns) {
      this.setState({
        searchableFields: MediaTable.getSearchableFields(nextProps.columns)
      });
    }
  }
   /**
   * Extrait et normalise les données du store.
   * Retourne un tableau de média, chacun ayant une valeur suplémentaire "isDeleting".
   */
  extractData() {
    const { mediaById, [this.props.mediaType]: { items }, isDeleting } = this.props.displayManagement;

    return items.map(function(id) {
      return {
        ...mediaById[id],
        isDeleting: isDeleting[id]
      };
    });
  }
 /**
   * Récupère les données du store devant être affichée. Cette méthode fait appel à `extractData` et `searchData`.
   */
  getShownData() {
    return this.searchData(this.extractData());
  }
  onSearch = (text) => {
    this.setState({ searchText: text });
    const filterTable = this.props.dataSource.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(text.toLowerCase())
      )
    );

    this.setState({ filterTable });
    //this.getShownData();
  }

  /**
   * Recherche dans les données passées en paramètre les enregistrements dont les champs
   * "searchable" correspondent au texte de recherche.
   */
  searchData(data) {
    if (! this.state.searchText) {
      return data;
    }

    const reg = new RegExp(this.state.searchText.replace(/ /g, '|'), 'gi');
    
    return data.map((media) => {
      let match = false;
      for (let field of this.state.searchableFields) {
        match |= !!media[field].match(reg);
        if (match) {
          return media;
        }
      }
      return false;
    }).filter((record) => !!record);
  }

  render() {

    const { dataSource, onSearch, ...otherProps } = this.props;
    //const data = this.getShownData();
   // const loading = this.props.displayManagement[this.props.mediaType].isFetching;
    return (
      <DataTable
        {...otherProps}
        
        columns={this.props.columns}
        dataSource={this.state.filterTable == null ? dataSource : this.state.filterTable}
        loading={this.props.loading}
        onAdd={this.props.onAdd}
        onDelete={this.props.onDelete}
        onDeleteSelection={this.props.onDeleteSelection}
        onEdit={this.props.onEdit}
        onRefresh={this.props.onRefresh}
        onSearch={this.onSearch}
        rowSelection={this.props.rowSelection}

        />
    );
  }
}
