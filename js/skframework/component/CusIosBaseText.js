'use strict';

import React, { Component } from 'react';

import {
  Text,
} from 'react-native';

class CusIosBaseText extends Component {

	render() {

	    return (
	      <Text {...this.props} allowFontScaling={false}>
	      </Text>
	    );
	}

}

export default CusIosBaseText;
