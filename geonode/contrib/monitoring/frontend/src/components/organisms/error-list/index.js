import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HoverPaper from '../../atoms/hover-paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import styles from './styles';
import actions from './actions';


const mapStateToProps = (state) => ({
  errorList: state.errorList.response,
  from: state.interval.from,
  to: state.interval.to,
});


@connect(mapStateToProps, actions)
class ErrorList extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    errorList: PropTypes.object,
    from: PropTypes.object,
    get: PropTypes.func.isRequired,
    to: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleClick = (row, column, event) => {
      this.context.router.push(`/errors/${event.target.dataset.id}`);
    };
  }

  componentWillMount() {
    this.props.get(this.props.from, this.props.to);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.from && nextProps.to) {
      if (this.props.from !== nextProps.from) {
        this.props.get(nextProps.from, nextProps.to);
      }
    }
  }

  render() {
    const errorList = this.props.errorList;
    const errors = this.props.errorList
                 ? errorList.exceptions.map(
                   error => <TableRow key={error.id}>
                     <TableRowColumn data-id={error.id}>{error.id}</TableRowColumn>
                     <TableRowColumn data-id={error.id}>{error.error_type}</TableRowColumn>
                     <TableRowColumn data-id={error.id}>{error.service.name}</TableRowColumn>
                     <TableRowColumn data-id={error.id}>{error.created}</TableRowColumn>
                   </TableRow>
                 ) : '';
    return (
      <HoverPaper style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>Errors</h3>
        </div>
        <Table onCellClick={this.handleClick}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Type</TableHeaderColumn>
              <TableHeaderColumn>Service</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover stripedRows displayRowCheckbox={false}>
            {errors}
          </TableBody>
        </Table>
      </HoverPaper>
    );
  }
}


export default ErrorList;
