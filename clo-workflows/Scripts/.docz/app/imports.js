export const imports = {
  'src/components/App/App.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-app-app" */ 'src/components/App/App.mdx'),
  'src/components/DescriptiveCheckbox/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-descriptive-checkbox-index" */ 'src/components/DescriptiveCheckbox/index.mdx'),
  'src/components/DescriptiveDropdown/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-descriptive-dropdown-index" */ 'src/components/DescriptiveDropdown/index.mdx'),
  'src/components/Header/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-header-index" */ 'src/components/Header/index.mdx'),
  'src/components/HeaderBreadcrumb/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-components-header-breadcrumb-index" */ 'src/components/HeaderBreadcrumb/index.mdx'),
}
