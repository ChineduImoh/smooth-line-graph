import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphStraight } from '../../examples/straight';

describe('<LineGraphStraight />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/straight.svg'), 'utf-8');
    });

    it('should render a graph with straight lines', () => {
        expect(renderToString(<LineGraphStraight />)).to.equal(result);
    });
});

