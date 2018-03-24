import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { LineGraphRandomWalk } from '../../examples/randomwalk';

describe('<LineGraphRandomWalk />', () => {
    let result = null;
    before(async () => {
        result = await fs.readFile(path.join(__dirname, '../../examples/randomwalk.svg'), 'utf-8');
    });

    it('should render a simple random walk graph', () => {
        expect(renderToString(<LineGraphRandomWalk />)).to.equal(result);
    });
});

