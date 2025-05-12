
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import PieDataContainer from "./PieDataContainer";
import "../styles/PieChart.css";

const PieChart = ({ channels, color, flightState }) => {
  const svgRef = useRef(null);

  
  const budgets = channels.map((d) => d.budget);
  const [minB, maxB] = [d3.min(budgets), d3.max(budgets)];
  let base = "";
  let adjustedColor = color;
  if (flightState !== "active") {
    base = d3.hsl("#808080");
    adjustedColor="#808080";
  } else {
    base = d3.hsl(color);
  }

  const offset = 0.3;
  const light = Math.min(base.l + offset, 1);
  const dark = Math.max(base.l - offset, 0);
  const lightness = d3.scaleLinear().domain([minB, maxB]).range([light, dark]);

  const pieGen = d3.pie().value((d) => d.budget);
  const slices = pieGen(channels);
  const sliceColors = slices.map((d) => d3.hsl(base.h, base.s, lightness(d.data.budget)).toString());

  useEffect(() => {
    const padding = 80; 
    const width = 600 + padding * 2;
    const height = width;
    const radius = 600 / 2; 

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const total = d3.sum(channels, (d) => d.budget);
    const formatter = d3.format(",");

    const g = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    const arcGen = d3
      .arc()
      .innerRadius(radius * 0.75)
      .outerRadius(radius);

    g.selectAll("path")
      .data(slices)
      .enter()
      .append("path")
      .attr("d", arcGen)
      .attr("fill", (_, i) => sliceColors[i])
      .on("mouseover", (event, d) => {
        const pct = ((d.data.budget / total) * 100).toFixed(2);
        tooltipText1.text(`${d.data.name}`);
        tooltipText2.text(`$${formatter(d.data.budget)} - ${pct}%`);
        updateTooltipRectSize();
        tooltipG.style("display", null);
      })
      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event, svg.node());
        const tooltipBBox = tooltipRect.node().getBBox();
        const tooltipX = x - radius - tooltipBBox.width;
        const tooltipY = y - radius - tooltipBBox.height-50; 
        tooltipG.attr("transform", `translate(${tooltipX}, ${tooltipY})`);
        svg.style("cursor", "none"); 
            })
            .on("mouseout", () => {
        svg.style("cursor", null); 
        tooltipG.style("display", "none");
      });

    const tooltipG = g.append("g").style("display", "none");

    const tooltipText1 = tooltipG
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "0.85em")
      .attr("font-family", "'Universal Sans 460', sans-serif")
      .attr("x", 10)
      .attr("y", 20);

    const tooltipText2 = tooltipG
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "0.85em")
      .attr("font-family", "'Universal Sans 460', sans-serif")
      .attr("x", 10)
      .attr("y", 38);

    
    const tooltipRect = tooltipG
      .insert("rect", ":first-child")
      .attr("fill", adjustedColor)
      .attr("stroke", adjustedColor)
      .attr("stroke-width", 1)
      .attr("rx", 6)
      .attr("ry", 6);
      tooltipRect.style("pointer-events", "none");
      tooltipText1.style("pointer-events", "none");
      tooltipText2.style("pointer-events", "none");
      
 
    const updateTooltipRectSize = () => {
      const text1BBox = tooltipText1.node().getBBox();
      const text2BBox = tooltipText2.node().getBBox();
      const padding = 10;
      const width = Math.max(text1BBox.width, text2BBox.width) + padding * 2;
      const height = text2BBox.y + text2BBox.height - text1BBox.y + padding * 2;

      tooltipRect
        .attr("width", width)
        .attr("height", height)
        .attr("x", text1BBox.x - padding)
        .attr("y", text1BBox.y - padding);
    };

    g.append("text")
      .attr("text-anchor", "middle")
      .style("font-family", "'Universal Sans 460', sans-serif")
      .style("font-size", "0.8em")
      .attr("dy", "-1.6em")
      .text("Total Spend");

    g.append("text")
      .attr("text-anchor", "middle")
      .style("font-family", "'Universal Sans 306', sans-serif")
      .style("font-size", "40px")
      .attr("dy", "20px")
      .text(`$${formatter(total)}`);
  }, [channels, sliceColors.join(",")]);

  return (
    <div className="pie__chart__container">
      <div className="pie__chart" style={{ position: "relative" }}>
        <svg ref={svgRef} />
      </div>
      <PieDataContainer data={channels} sliceColors={sliceColors} />
    </div>
  );
};

export default PieChart;
