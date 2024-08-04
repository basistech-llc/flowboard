import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

/**
 * Markdown component to render Markdown content with predefined styling.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.markdown - The Markdown content to render.
 * @returns {JSX.Element} The rendered Markdown content with styling.
 *
 * This component uses the ReactMarkdown library to parse and display Markdown
 * content.
 */
const Markdown = ({ markdown }) => {
  return (
    <MarkdownStyling>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </MarkdownStyling>
  );
};

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

/**
 * Styled component for Markdown content.
 */
const MarkdownStyling = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: #222;
  max-width: 50em;
  margin: 0 auto;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    color: #3a539b;
  }

  p,
  ul,
  ol {
    margin-bottom: 1em;
  }

  ul,
  ol {
    padding-left: 20px;
  }
`;

export default Markdown;
