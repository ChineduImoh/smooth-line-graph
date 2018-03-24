import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphTime } from '../../examples/time';

describe('<LineGraphTime />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/time.svg'), 'utf-8');
    });

    it('should render a graph with a time axis', () => {
        expect(renderToString(<LineGraphTime />)).to.equal(result);
    });
});

