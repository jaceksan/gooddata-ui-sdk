// (C) 2007-2020 GoodData Corporation
import { colors2Object, INumberObject, ISeparators, numberFormat } from "@gooddata/numberjs";
import { customEscape, percentFormatter } from "../utils/common";
import isNil from "lodash/isNil";
import { IPointData } from "../typings/unsafe";

export function formatValueForTooltip(
    val: string | number,
    format: string,
    separators?: ISeparators,
): string {
    const formattedObject: INumberObject = colors2Object(numberFormat(val, format, undefined, separators));
    return customEscape(formattedObject.label);
}

export function getFormattedValueForTooltip(
    isDualChartWithRightAxis: boolean,
    stackMeasuresToPercent: boolean,
    point: IPointData,
    separators?: ISeparators,
    percentageValue?: number,
): string {
    const { target, y, format } = point;
    const isNotStackToPercent =
        stackMeasuresToPercent === false || isNil(percentageValue) || isDualChartWithRightAxis;
    return isNotStackToPercent
        ? formatValueForTooltip(target ?? y, format, separators)
        : percentFormatter(percentageValue);
}
