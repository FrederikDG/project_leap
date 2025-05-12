import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../styles/TimeLineChart.css";

export default function TimelineChartD3({ flights, color }) {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 40, right: 0, bottom: 40, left: 200 };
    const width = 1000;
    const height = flights.length * 45 + margin.top + margin.bottom;
    const barOffset = 0;
    const now = new Date();
    function parseGMT4(dateOnly) {
      return new Date(`${dateOnly}T00:00:00-04:00`);
    }

    const data = flights.map((f, i) => ({
      ...f,
      start: parseGMT4(f.start),
      end: parseGMT4(f.end),
      name: `Flight ${i + 1}`,
    }));

    const allDates = data.flatMap((d) => [d.start, d.end]);
    const minDate = d3.min(allDates),
      maxDate = d3.max(allDates);
    const firstOfFirstMonth = d3.timeMonth.floor(minDate),
      endOfLastMonth = d3.timeMonth.ceil(maxDate);
    const xScale = d3
      .scaleTime()
      .domain([firstOfFirstMonth, endOfLastMonth])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.top, height - margin.bottom]);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)

      .style("border", "none");

    const chartHeight = height - margin.top - margin.bottom;

    svg
      .append("g")
      .attr("class", "grid x-grid")
      .attr("transform", `translate(-1, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(1))

          .tickSizeInner(-chartHeight)

          .tickSizeOuter(0)
          .tickFormat("")
      )
      .call((g) => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke-dasharray", "1 6")
      .attr("stroke", "#000")
      .filter((d, i, nodes) => i === nodes.length - 1)
      .remove();

    const step = yScale.step();
    const boundaries = d3.range(data.length + 1);

    // Horizontal grid lines

    svg
      .append("g")
      .attr("class", "grid y-grid")
      .attr("transform", `translate(-300, 0)`)
      .selectAll("line")
      .data(boundaries)
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right + 300)
      .attr("y1", (d) => margin.top + d * step)
      .attr("y2", (d) => margin.top + d * step)
      .attr("stroke-dasharray", "1 6")
      .attr("stroke", "#000");

    // Bar Boxes

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.start))
      .attr("y", (d) => yScale(d.name) + 6)
      .attr("width", (d) => xScale(d.end) - xScale(d.start))
      .attr("height", yScale.bandwidth() - 12)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", (d) => {
        return now >= d.start && now <= d.end ? color : "#F0F0F0";
      });

    if (now >= firstOfFirstMonth && now <= maxDate) {
      const xPos = xScale(now);

      svg
        .append("line")
        .attr("x1", xPos)
        .attr("y1", margin.top - 19)
        .attr("x2", xPos)
        .attr("y2", height - margin.bottom)
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .style("z-index", "-10");

      const cornerRadius = 5;
      const size = 8;
      const labelWidth = 40;
      const labelHeight = 20;
      const x = xPos + size - 8;
      const y = margin.top + size * 1.5 - 51;
      const r = cornerRadius;
      const d = [
        `M${x},${y}`,
        `h${labelWidth - r}`,
        `a${r},${r} 0 0 1 ${r},${r}`,
        `v${labelHeight - 2 * r}`,
        `a${r},${r} 0 0 1 -${r},${r}`,
        `h-${labelWidth - r}`,
        `Z`,
      ].join(" ");
      svg
        .append("path")
        .attr("d", d)
        .attr("x", xPos + size - 8)
        .attr("y", margin.top + size * 1.5 - 51)
        .attr("width", labelWidth)
        .attr("height", labelHeight)
        .attr("fill", color)
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.2);

      svg
        .append("text")
        .attr("x", xPos + size - 2)
        .attr("y", margin.top + size * 1.5 - 38)
        .attr("fill", color)
        .style("font-size", "10px")
        .style("font-weight", 400)
        .text("Today")
        .style("font-family", "'Universal Sans 460', sans-serif");
    }

    // === Bar Labels (date range only) ===
    const TimeLineThreshold = 100; // only bars ≥100px will get a spend label
    const budgetThreshold = 160; // only bars ≥100px will get a spend label

    // Date labels (always shown)
    svg
      .append("g")
      .selectAll("text.label")
      .data(
        // filter out any flights whose pixel‐width is under the threshold
        data.filter((d) => xScale(d.end) - xScale(d.start) >= TimeLineThreshold)
      )
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.start) + 7)
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2 + 4)
      .text((d) => `${d3.timeFormat("%b %d")(d.start)} — ${d3.timeFormat("%b %d")(d.end)}`)
      .attr("fill", "#000")
      .style("font-size", "12px")
      .style("font-weight", 500)
      .style("font-family", "'Universal Sans 460', sans-serif");

    // Spend labels (only on wide bars)
    svg
      .append("g")
      .selectAll("text.budget")
      .data(
        // filter out any flights whose pixel‐width is under the threshold
        data.filter((d) => xScale(d.end) - xScale(d.start) >= budgetThreshold)
      )
      .join("text")
      .attr("class", "budget")
      .attr("x", (d) => xScale(d.end) - 7) // pad 5px from right edge
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .text((d) => {
        const budget = d.budget.toString();
        return budget.length > 3 ? `$${budget.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : `$${budget}`;
      })
      .attr("fill", "#000")
      .style("font-size", "12px")
      .style("font-weight", 500)
      .style("font-family", "'Universal Sans 460', sans-serif");

    const months = d3.timeMonths(firstOfFirstMonth, endOfLastMonth);

    svg
      .append("g")
      .attr("class", "month-labels")
      .attr("transform", `translate(0, ${height - margin.bottom + 15})`)
      .selectAll("text")
      .data(months)
      .join("text")
      .attr("x", (d) => {
        const startX = xScale(d);
        const nextMonth = d3.timeMonth.offset(d, 1);
        const endX = xScale(nextMonth);
        return (startX + endX) / 2;
      })
      .text((d) => d3.timeFormat("%b '%y")(d))
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", 400)
      .style("fill", "#3d3c3f")
      .style("font-family", "'Universal Sans 460', sans-serif");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left - 180}, ${barOffset})`)
      .call(d3.axisLeft(yScale))

      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .style("font-size", "12px")
      .style("text-anchor", "start")
      .style("font-family", "'Universal Sans 460', sans-serif");

    const activeFlights = data.filter((d) => now >= d.start && now <= d.end);

    const activeGroups = svg
      .append("g")
      .attr("transform", `translate(${margin.left - 130}, 0)`)
      .selectAll("g.active-group")
      .data(activeFlights)
      .join("g")
      .attr("class", "active-group")

      .attr("transform", (d) => `translate(-10, ${yScale(d.name) + yScale.bandwidth() / 2 + 2})`);

    activeGroups.each(function () {
      const g = d3.select(this);

      const label = g
        .append("text")
        .text("ACTIVE")
        .attr("x", 5)
        .attr("y", 1)
        .attr("fill", "#000")
        .style("font-size", "10px")
        .style("font-weight", 500)
        .style("font-family", "'Neue Machina', sans-serif");

      const bbox = label.node().getBBox();

      g.insert("rect", "text")
        .attr("x", bbox.x - 5)
        .attr("y", bbox.y - 4)
        .attr("width", bbox.width + 10)
        .attr("height", bbox.height + 6)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", color);
    });
  }, [flights, color]);

  return <svg ref={svgRef} className="timeline-chart" />;
}
