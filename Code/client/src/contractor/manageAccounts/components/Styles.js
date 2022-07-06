export const formStyles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
    height: 52,
    paddingTop: 7,
  },
  sizePrefix: {
    // fontSize: 20,
    // color: '#239DFF',
  },
  sizePostfix: {
    fontSize: 14,
  },

  error: {
    fontSize: 14,
  },
  dropdownList: {
    width: '100%',
    height: 52,
    border: '1px solid #F6F6F6',
    borderRadius: '5px',
    backgroundColor: '#F6F6F6',
  },
  dropdownListIcon: {
    listBox: {
      width: '100%',
      height: 52,
      borderRadius: '5px',
      backgroundColor: '#F6F6F6',
    },
    icon: {
      fontSize: 16,
      lineHeight: '52px',
    },
    select: {
      width: '94%',
      backgroundColor: '#F6F6F6',
      border: '1px solid #F6F6F6',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
  },
  datePicker: {
    color: '#8B9DAD',
    marginBottom: 5,
    fontWeight: 'bold',
  },
};

const styles = {
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
    fontWeight: 400,
  },

  pageTitle: {
    color: '#1D415D',
  },

  pageTitleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
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
    lineHeight: '14px',
    fontSize: 14,
    padding: '10px 15px',
    border: '1px solid #DCE1E6',
    color: '#666666',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
    height: 34,
    width: 180,
    textAlign: 'center',
  },
  usersTabActive: {
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
  },
  deleteButton: {
    minWidth: 100,
    backgroundColor: '#F06666',
    color: '#FFFFFF',
    border: '1px solid #F06666',
    height: 30,
    fontSize: 18,
    borderRadius: 3,
  },
  deleteIcon: {
    marginRight: 5,
  },
  searchRow: {
    display: 'initial',
  },

  actionReactivateButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #72C814',
    color: '#F9FCFE',
    backgroundColor: '#72C814',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  actionSuspendButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #EEBF15',
    color: '#F9FCFE',
    backgroundColor: '#EEBF15',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  actionDeleteButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #F06666',
    color: '#F9FCFE',
    backgroundColor: '#F06666',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
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
    borderRadius: '3px',
  },
  buttonText: {
    paddingLeft: 5,
  },
  cellCursor: {
    cursor: 'pointer',
  },

  showMe: {
    display: 'inline-block',
  },
  hideMe: {
    display: 'none',
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
    // border: '2px solid #1D415D',
    fontSize: 48,
    borderRadius: 25,
    // width: 40,
    // height: 40,
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


export default styles;
