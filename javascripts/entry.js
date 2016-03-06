require('../less/main.less');

'use strict';

import React from "react";
React.render(<div className="myDiv">Hello Electron!</div>, document.getElementById('content'));
React.render(<div className='myDiv'>This is new </div>, document.getElementById('content'));