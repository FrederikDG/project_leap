import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "../styles/ChannelGraph.css";

const METRIC_OPTIONS = [
  { key: "impressions", label: "Impressions" },
  { key: "cpm", label: "CPM" },
  { key: "yearOverYear", label: "Year over Year %" },
];

const DOMAIN_OPTIONS = [
  { key: "extended", label: "Auto Scale" },
  { key: "zeroToMax", label: "0 to Max" },
];

const CURVE_OPTIONS = [
  { key: "linear", label: "Linear" },
  { key: "basis", label: "Basis" },
  { key: "catmullRom", label: "Smooth" },
];

export default function MetricsGraph({ data, color = "#69b3a2" }) {
  const svgRef = useRef();
  const [selectedMetric, setSelectedMetric] = useState(METRIC_OPTIONS[0].key);
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_OPTIONS[0].key);
  const [selectedCurve, setSelectedCurve] = useState(CURVE_OPTIONS[2].key);

  const weeks = Array.isArray(data)
    ? data
    : Array.isArray(data.weeks)
    ? data.weeks
    : [];

  useEffect(() => {
    if (!weeks.length) return;

    const margin = { top: 40, right: 10, bottom: 30, left: 30 };
    const width = 800;
    const height = 260;

    // parse & map
    const parseDate = d3.timeParse("%Y-%m-%d");
    const points = weeks.map((d) => ({
      week: parseDate(d.week),
      value: d.metrics[selectedMetric],
    }));

    // formatter for Y-axis ticks and hover flag
    const formatY = (d) => {
      const base = d >= 1000 ? `${d / 1000}k` : d;
      if (selectedMetric === 'cpm') return `$${base}`;
      if (selectedMetric === 'yearOverYear') return `${base}%`;
      return base;
    };

    // X scale
    const xScale = d3.scaleTime()
      .domain(d3.extent(points, (d) => d.week))
      .range([margin.left, width - margin.right]);

    // Determine raw min/max
    const rawMin = d3.min(points, (d) => d.value);
    const rawMax = d3.max(points, (d) => d.value);

    // Create a temporary scale to compute tick spacing
    const tempScale = d3.scaleLinear().domain([rawMin, rawMax]);
    const tickCount = 5;
    const ticks = tempScale.ticks(tickCount);
    const tickSpacing = ticks[1] - ticks[0];

    // Extend domain by one tick above and below
    const extendedDomain = [
      rawMin === ticks[0] ? ticks[0] : ticks[0] - tickSpacing,
      rawMax === ticks[ticks.length - 1] ? ticks[ticks.length - 1] : ticks[ticks.length - 1] + tickSpacing,
    ];

    // Choose Y domain based on dropdown
    const yDomain =
    selectedDomain === 'zeroToMax'
      ? [0, rawMax + tickSpacing]
      : extendedDomain;
    // Y scale
    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Choose curve function
    let curveFn;
    switch (selectedCurve) {
      case 'linear':
        curveFn = d3.curveLinear;
        break;
      case 'basis':
        curveFn = d3.curveBasis;
        break;
      case 'catmullRom':
      default:
        curveFn = d3.curveCatmullRom;
    }

    const line = d3.line()
      .curve(curveFn)
      .x((d) => xScale(d.week))
      .y((d) => yScale(d.value));

    const area = d3.area()
      .curve(curveFn)
      .x((d) => xScale(d.week))
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.value));

    // setup svg
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // defs: gradient + shadow
    const defs = svg.append("defs");
    defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", 0).attr("x2", 0)
      .attr("y1", 0).attr("y2", 1)
      .selectAll("stop")
      .data([
        { offset: "0%", opacity: 0.4 },
        { offset: "100%", opacity: 0 },
      ])
      .enter().append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", color)
      .attr("stop-opacity", (d) => d.opacity);

    const shadowFilter = defs.append("filter")
      .attr("id", "box-shadow")
      .attr("x", "-50%").attr("y", "-50%")
      .attr("width", "200%").attr("height", "200%");
    shadowFilter.append("feDropShadow")
      .attr("dx", 0).attr("dy", 0)
      .attr("stdDeviation", 2)
      .attr("flood-color", "#000")
      .attr("flood-opacity", 0.2);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 5})`)
      .call((g) =>
        g.call(d3.axisBottom(xScale)
          .ticks(weeks.length)
          .tickFormat(d3.timeFormat("%-m/%-d"))
          .tickSize(0)
        )
        .call((g) => g.selectAll(".domain").remove())
        .call((g) => g.selectAll("text")
          .style("font-family", "'Universal Sans 460', sans-serif")
          .style("font-size", "8px")
          .style("fill", "#3d3c3f")
          .style("text-anchor", (d, i) =>
            i === 0 ? "start" : i === weeks.length - 1 ? "end" : "middle"
          )
        )
      );

    // Y axis + grid
    svg.append("g")
      .attr("transform", `translate(${margin.left - 4},0)`)
      .call((g) =>
        g.call(d3.axisLeft(yScale)
          .ticks(tickCount)
          .tickSize(0)
          .tickFormat(formatY)
        )
        .call((g) => g.selectAll(".domain").remove())
        .call((g) => g.selectAll("text")
          .style("font-family", "'Universal Sans 460', sans-serif")
          .style("font-size", "8px")
          .style("fill", "#3d3c3f")
        )
      );

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call((g) =>
        g.call(d3.axisLeft(yScale)
          .ticks(tickCount)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat("")
        )
        .call((g) => g.selectAll(".domain").remove())
      )
      .selectAll("line")
      .style("stroke", "#dfdfdf");

    // plot area + line + endpoints
    svg.append("path").datum(points)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    svg.append("path").datum(points)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.selectAll(".endpoint")
      .data([points[0], points[points.length - 1]])
      .enter().append("circle")
      .attr("class", "endpoint")
      .attr("cx", (d) => xScale(d.week))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 1)
      .attr("fill", color);

    // Hover interactivity continues unchanged...
    const bisectDate = d3.bisector((d) => d.week).left;
    const focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("line")
      .attr("class", "hover-line")
      .attr("y1", margin.top - 30)
      .attr("y2", height - margin.bottom)
      .attr("stroke", color)
      .attr("stroke-width", 1);

    focus.append("circle")
      .attr("class", "hover-circle-bg")
      .attr("r", 5)
      .attr("fill", "white")
      .attr("filter", "url(#box-shadow)");

    focus.append("circle")
      .attr("class", "hover-circle")
      .attr("r", 3)
      .attr("fill", color);

    focus.append("path")
      .attr("class", "hover-flag")
      .attr("fill", color)
      .attr("fill-opacity", 0.2)
      .attr("stroke", color)
      .attr("stroke-width", 1);

    focus.append("text")
      .attr("class", "hover-flag-text")
      .attr("alignment-baseline", "middle")
      .style("font-family", "'Universal Sans 460', sans-serif")
      .style("font-size", "8px")
      .style("font-weight", 400)
      .attr("fill", color);

    svg.append("rect")
      .attr("class", "overlay")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", function(event) {
        const [mx] = d3.pointer(event, this);
        const x0 = xScale.invert(mx);
        const i = bisectDate(points, x0, 1);
        const d0 = points[i - 1];
        const d1 = points[i] || d0;
        const d = x0 - d0.week > d1.week - x0 ? d1 : d0;
        const xPos = xScale(d.week);
        const yPos = yScale(d.value);

        focus.select(".hover-line")
          .attr("x1", xPos).attr("x2", xPos);
        focus.select(".hover-circle-bg")
          .attr("cx", xPos).attr("cy", yPos);
        focus.select(".hover-circle")
          .attr("cx", xPos).attr("cy", yPos);

        // formatting hover flag value
        const rawVal = d.value.toLocaleString();
        const valText =
          selectedMetric === 'cpm'
            ? `$${rawVal}`
            : selectedMetric === 'yearOverYear'
            ? `${rawVal}%`
            : rawVal;

        const txt = focus.select(".hover-flag-text")
          .text(valText)
          .attr("x", -9999).attr("y", -9999);
        const bbox = txt.node().getBBox();
        const padX = 6, padY = 4;
        const flagW = bbox.width + padX * 2;
        const flagH = bbox.height + padY * 2;
        const r = 5;

        const isLast = d === points[points.length - 1];
        txt.attr("text-anchor", isLast ? "end" : "start");

        const fx = xPos;
        const fy = margin.top - 30;
        let pathD;
        if (isLast) {
            pathD = [
            `M${fx},${fy}`,
            `h-${flagW - r}`,
            `a${r},${r} 0 0 0 -${r},${r}`,
            `v${flagH - 2*r}`,
            `a${r},${r} 0 0 0 ${r},${r}`,
            `h${flagW - r}`,
            `Z`
            ].join(" ");
        } else {
          pathD = [
            `M${fx},${fy}`,
            `h${flagW - r}`,
            `a${r},${r} 0 0 1 ${r},${r}`,
            `v${flagH - 2*r}`,
            `a${r},${r} 0 0 1 -${r},${r}`,
            `h-${flagW - r}`,
            `Z`
          ].join(" ");
        }
        focus.select(".hover-flag").attr("d", pathD);

        txt
          .attr("x", isLast ? fx - padX : fx + padX)
          .attr("y", fy + padY + bbox.height / 2 + 1);
      });
  }, [weeks, color, selectedMetric, selectedDomain, selectedCurve]);

  return (
    <div className="channel__graph__container">
      <div className="controls">
        <select
          id="metricSelect"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          {METRIC_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          id="domainSelect"
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          id="curveSelect"
          value={selectedCurve}
          onChange={(e) => setSelectedCurve(e.target.value)}
        >
          {CURVE_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
        <select id="channelSelect">
          <option value="">Youtube TV</option>
        </select>
      </div>
      <svg ref={svgRef} className="metrics__graph" />
      <p className="addition__text">week of</p>
    </div>
  );
}
