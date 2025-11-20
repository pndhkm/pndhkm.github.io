import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

// Load Blog JSON
const blogReq = require.context(
  "@generated/docusaurus-plugin-content-blog/default",
  false,
  /site-blog-.*\.json$/
);
const rawBlogPosts = blogReq.keys().map((key) => blogReq(key));
const allBlogPosts = rawBlogPosts.flatMap((p) => (Array.isArray(p) ? p : [p]));
const blogMap = allBlogPosts.reduce((acc, post) => {
  if (post.source && !acc[post.source]) acc[post.source] = post;
  return acc;
}, {} as Record<string, any>);
const blogPosts = Object.values(blogMap);

// Load Docs JSON
const docsReq = require.context(
  "@generated/docusaurus-plugin-content-docs/default",
  false,
  /.*\.json$/
);
const rawDocs = docsReq.keys().map((key) => docsReq(key));
const allDocs = rawDocs.flatMap((d) => (Array.isArray(d) ? d : [d]));
const docsMap = allDocs.reduce((acc, doc) => {
  if (doc.id && !acc[doc.id]) acc[doc.id] = doc;
  return acc;
}, {} as Record<string, any>);
const docsPosts = Object.values(docsMap);

// Filtering Project
const projectPosts = blogPosts.filter(
  (p) =>
    typeof p.title === "string" &&
    typeof p.permalink === "string" &&
    Array.isArray(p?.tags) &&
    p.tags.some((t) => t && t.label === "project")
);

export default function ProjectsPage() {
  return (
    <Layout title="Projects">
      <main className="container margin-vert--lg">
        <h1 className="margin-bottom--lg">Projects</h1>

        <div className="row">
          {projectPosts.map((post) => {
            const blogSlug = post.permalink.split("/").filter(Boolean).pop();

            const hasTutorial = docsPosts.some(
              (doc) =>
                typeof doc.id === "string" &&
                blogSlug &&
                doc.id.toLowerCase().includes(blogSlug.toLowerCase())
            );

            return (
              <div className="col col--6 margin-bottom--lg text--center" key={post.source}>
                <div className="card">
                  <div className="card__header">
                    <h3>
                      <Link to={post.permalink}>{post.title}</Link>
                    </h3>
                  </div>

                  <div className="card__footer">
                    <Link
                      to={post.permalink}
                      className="button button--primary button--md margin-right--sm"
                    >
                      Blog
                    </Link>

                    {hasTutorial && blogSlug && (
                      <Link
                        to={`/docs/category/${blogSlug}`}
                        className="button button--secondary button--md"
                      >
                        Tutorial
                      </Link>
                    )}
                  </div>

                  {/* Debug */}
                  {/* <div style={{ marginTop: 8, fontSize: "0.8em", color: "#555", textAlign: "left" }}>
                    <div><strong>Blog slug:</strong> {blogSlug}</div>
                    <div><strong>Has Tutorial:</strong> {hasTutorial ? "Yes" : "No"}</div>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
