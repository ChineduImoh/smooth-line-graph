import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphLog } from '../../examples/log';

describe('<LineGraphLog />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/log.svg'), 'utf-8');
    });

    it('should render a graph with smooth lines, on a log scale', () => {
        expect(renderToString(<LineGraphLog />)).to.equal(result);
    });
});


