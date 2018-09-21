import React, { Component } from 'react';
import { Rpc } from 'eosjs2'; // https://github.com/EOSIO/eosjs2

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// eosio endpoint
var jungle = true;
var endpoint = "https://api.eosrio.io";
if(jungle)
  endpoint = "https://api.jungle.alohaeos.com";


const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 5,
    maxWidth: "600px"
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#eee",
    padding: 4,
    marginBottom: 0.
  }
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hbTable: [] // to store the table rows from smart contract
    };
  }

  generateLayout(cards) {
    return cards.map(function(item, i) {
      const y = 4;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  
  getTable() {
    const rpc = new Rpc.JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "dappnetwork1",   // contract who owns the table
      "scope": "dappnetwork1",  // scope of the table
      "table": "dapp",    // name of the table as specified by the contract abi
      "limit": 500,
    }).then(result => this.setState({ hbTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    let { hbTable } = this.state;
    const { classes } = this.props;

    const generateCard = (key, contract, data) => {
      var cardData;
      try{
        cardData = JSON.parse(data);
      }
      catch(e){
        return (<span/>);
      }
      var this2 = this;
    
      let minH = Math.floor(Object.keys(cardData).length / 2) + 3;
      if(!cardData.enabled)
        return (<span/>);
      
      var applink = cardData.appurl;
      if(!cardData.appurl && cardData.ipfshash){
        applink = `https://cloudflare-ipfs.com/ipfs/${cardData.ipfshash}/`;
      }
      var appname = cardData.name || contract;
        
      function onclickh(e){
        this2.setState({ selected: applink });
        e.preventDefault();
        return false;
      };
      
      if(contract === "dappnetwork1" && window.location.href.indexOf(applink) === -1){
          window.location.href = applink;
      }
      
      return  (
      <Card className={classes.card} key={key} data-grid={{ w: 2, h: minH, x: (key * 2) % 6, y: Math.floor(key / 3)}}>
        <CardContent  style={{padding:5}}>
        <a href={applink} onClick={onclickh}>
          <Typography variant="headline" style={{fontSize:18, color: "#ddf" }} component="h2">
            {appname} 
          </Typography>
          <Typography style={{fontSize:13}} color="default" gutterBottom>
            {contract}
          </Typography>
          </a>
            <table>
              <tbody>
                  {Object.keys(cardData).map(key=>{
                    return <tr><td>
                    <Typography style={{fontSize:10}}  color="textSecondary" component="pre">
                    {key}:
                    </Typography>
                    </td> <td>
                    <Typography style={{fontSize:10}}  color="textPrimary" component="pre">
                    {cardData[key].toString()}
                    </Typography>
                    </td> </tr>
                  })}
              </tbody>
            </table>
            
          
        </CardContent>
      </Card>
    )};
    
    // if(debug && hbTable.length){
    //   var temp = [];
    //   for (var i = 0; i < 100; i++) {
    //     temp.push(hbTable[0]);
    //   }
    //   hbTable = temp;
    // }    
    let cards = hbTable.map((row, i) =>
      generateCard(i, row.contract, row.metadata));
    var height = window.innerHeight * 0.85;
    var theframe = (this.state.selected ? (<div>
    <a href={this.state.selected} target="_blank">
    <Typography variant="title" color="inherit" style={{fontSize:13, color: "#fff" }}>
            Open in a new tab
          </Typography></a>
    <iframe title='content' src={this.state.selected} style={{
    height: `${height}px`,
    minHeight: "200px",
    width: "99%",
    resize: 'both',
    overflow: 'auto',
  }} /></div>) : (<span/>));

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{background: "#0f0f0f", height: "100%", width: "100%"}}>
          <AppBar position="static" style={{background: "#000"}} >
            <Toolbar>
              <div style={{"display": "flex", "alignItems":"center"}} >
                <img alt='logo' src="eos-logo.png" width="32" height="32"/> 
                <Typography variant="title" color="inherit">
                  <div style={{"marginLeft":"15px"}}> EOS DAPP Explorer </div>
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
        
                  {theframe}
         <ResponsiveReactGridLayout
          className="layout"
          items={cards.length}
          rowHeight={25}
          // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          // WidthProvider option
          isDraggable={false}
          isResizable={false}
          layouts={{}}
          // measureBeforeMount={false}
          // useCSSTransforms={true}
          compactType={'vertical'}
          preventCollision={true}
        >
          {cards}
        </ResponsiveReactGridLayout>

        </div>
      </MuiThemeProvider>
    );
  }

}

export default withStyles(styles)(Index);
