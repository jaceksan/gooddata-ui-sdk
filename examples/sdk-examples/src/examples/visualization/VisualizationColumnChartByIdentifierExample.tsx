// (C) 2007-2019 GoodData Corporation
import React from "react";
import { InsightView } from "@gooddata/sdk-ui";

import { projectId, columnVisualizationIdentifier } from "../../constants/fixtures";
import { useBackend } from "../../context/auth";

const style = { height: 300 };
const visualizationProps = {
    custom: {
        drillableItems: [],
    },
    dimensions: {
        height: 300,
    },
};

export const VisualizationColumnChartByIdentifierExample: React.FC = () => {
    const backend = useBackend();
    return (
        <div style={style} className="s-visualization-chart">
            <InsightView
                backend={backend}
                workspace={projectId}
                id={columnVisualizationIdentifier}
                visualizationProps={visualizationProps}
            />
        </div>
    );
};