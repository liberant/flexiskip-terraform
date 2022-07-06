import { APP_BACKGROUND_COLOR } from '../../../../common/constants/styles';

const styles = {
  actionButtonBox: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  actionButtonAddBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'center',
  },
  tableBox: {
    background: '#fff', margin: '0px 15px', padding: '0px 15px',
  },
  table: {
    borderLeft: '1px solid transparent',
    borderRight: '1px solid transparent',
    borderTop: '1px solid transparent',
  },

  title: {
    color: '#239DFF',
    fontWeight: '400',
  },

  header: {
    color: '#239DFF',
    fontSize: 13,
    fontWeight: 400,
  },
  checkbox: {
    fontSize: 20,
    fontWeight: 400,
  },

  cell: {
    cursor: 'pointer',
    textAlign: 'center',
  },

  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  usersTabBoxOuter: {
    padding: '10px 15px',
  },

  usersTabBox: {
    borderBottom: '0px solid black',
  },

  usersTab: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '1px solid #DCE1E6',
    color: '#666666',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '5px',
  },
  usersTabActive: {
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
  },
  deleteButton: {
    minWidth: 100,
    backgroundColor: '#FBB8B8',
    color: '#FFFFFF',
    border: '1px solid #FBB8B8',
    height: 30,
    fontSize: 18,
    borderRadius: 5,
  },
  deleteIcon: {
    marginRight: 5,
  },
  searchRow: {
    display: 'initial',
  },
  pageTitleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },

  actionReactivateButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#F9FCFE',
    backgroundColor: '#72c814',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '5px',
  },
  actionSuspendButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#F9FCFE',
    backgroundColor: '#F1DC89',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '5px',
  },
  actionDeleteButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#F9FCFE',
    backgroundColor: '#f06666',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '5px',
  },
  actionAddButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '5px',
  },
  buttonText: {
    paddingLeft: 5,
  },

  hideMe: {
    display: 'none',
  },
  showMeBtn: {
    display: 'inline-block',
  },
  showMeRow: {
    display: 'block',
  },

  cellCursor: {
    cursor: 'pointer',
  },

  cellInventoryAlert: {
    color: '#f06666',
    fontWeight: 600,
  },

};

export const stylesDetails = {
  headerBox: {
    marginTop: 20,
    marginBottom: 20,
  },
  backBox: {
    cursor: 'pointer',
    outline: 'none',
    color: '#1D415D',
    border: '2px solid #1D415D',
    fontSize: 32,
    borderRadius: 25,
    width: 40,
    height: 40,
    textAlign: 'center',
    fontWeight: 600,
    lineHeight: '34px',
  },
  backArrowBox: {
    display: 'flex',
    alignItems: 'center',
    color: '#1D415D',
  },
  backTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginLeft: 10,
    color: '#1D415D',
  },
  backText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 600,
    color: '#1D415D',
  },
};

export const formStyles = {
  label: {
    overflow: 'hidden',
  },
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
    // height: 50,
  },
  inputBox: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 14,
    lineHeight: '47px',
  },
  sizePostfix: {
    fontSize: 14,
    lineHeight: '47px',
  },
  textarea: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  dropdownList: {
    width: '100%',
    height: 41,
    borderWidth: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: 3,
    marginTop: 5,
    cursor: 'pointer',
  },
  checkboxOuterBox: {
    marginTop: '-6px',
  },
};

export const extraStyles = {
  extraProductsName: {
    display: 'inline-block',
    width: '60%',
  },
  extraProductsQuantity: {
    display: 'inline-block',
    width: '40%',
  },
};


export default styles;
