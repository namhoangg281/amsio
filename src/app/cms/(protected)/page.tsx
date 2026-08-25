import { redirect } from 'next/navigation';

// /cms → redirect to /cms/articles (list view)
export default function CmsRootPage() {
  redirect('/cms/articles');
}
