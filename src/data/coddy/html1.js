import { L } from './lesson.js';

// 섹션 1: 기초 (HTML)
export default [
  { title: 'HTML 기초', lessons: [
    L('HTML이란 무엇인가요?', 'A', 'body 안에 p 요소로 "Hello HTML"을 작성하세요.', 'HTML은 웹 페이지의 구조를 만드는 마크업 언어입니다. 브라우저가 태그를 읽어 화면에 보여 줍니다.', '<p>Hello HTML</p>', '<p>', 'Hello HTML', '</p>'),
    L('HTML의 기본 구조', 'A', 'html, head, body로 이루어진 기본 문서를 만들고 body에 h1 "My Page"를 쓰세요.', 'HTML 문서는 html 요소 안에 head(정보)와 body(화면에 보이는 내용)로 나뉩니다.', '<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <h1>My Page</h1>\n  </body>\n</html>', '<html>', '<head>', '<body>', 'My Page'),
    L('태그와 요소', 'A', 'p 요소에 "Tags wrap content"를 작성하세요.', '요소는 여는 태그 <p>, 내용, 닫는 태그 </p>로 이루어집니다.', '<p>Tags wrap content</p>', '<p>', '</p>', 'Tags wrap content'),
    L('중첩과 닫는 태그', 'A', 'div 안에 p를 중첩해 작성하세요.', '요소 안에 다른 요소를 넣을 수 있으며, 안쪽 요소를 먼저 닫아야 합니다.', '<div>\n  <p>Nested</p>\n</div>', '<div>', '<p>', '</div>'),
    L('HTML의 주석', 'A', '<!-- --> 주석과 p 요소를 함께 작성하세요.', '주석은 화면에 보이지 않는 메모입니다. <!-- 내용 --> 형태로 씁니다.', '<!-- 인사말 -->\n<p>Hi</p>', '<!--', '-->', '<p>'),
  ] },
  { title: '텍스트와 서식', lessons: [
    L('제목', 'A', 'h1 "Welcome to our pizza restaurant!"와 h2 "Our Menu"를 작성하세요.', 'h1부터 h6까지의 제목 요소로 구조를 나타냅니다. h1이 가장 중요한 제목입니다.', '<h1>Welcome to our pizza restaurant!</h1>\n<h2>Our Menu</h2>', '<h1>', '<h2>', 'Our Menu'),
    L('단락', 'M', '두 개의 p 요소에 "Welcome to our pizza restaurant!"와 "Explore our menu today."를 작성하세요.', 'p 요소는 문단을 만들며 위아래에 여백이 생깁니다.', '<p>Welcome to our pizza restaurant!</p>\n<p>Explore our menu today.</p>', '<p>', 'Welcome to our pizza restaurant!', 'Explore our menu today.'),
    L('줄 바꿈', 'M', 'p 안에 "Open daily"와 "11 AM - 10 PM"을 쓰고 둘 사이에 br을 넣으세요.', 'br은 줄만 바꾸며 닫는 태그가 없습니다.', '<p>Open daily<br>11 AM - 10 PM</p>', '<br>', 'Open daily', '11 AM - 10 PM'),
    L('굵게 및 기울임꼴 텍스트', 'M', 'strong에 "Fresh pizza", em에 "Made daily"를 작성하세요.', 'strong은 중요한 텍스트(굵게), em은 강조(기울임)를 의미합니다.', '<strong>Fresh pizza</strong>\n<em>Made daily</em>', '<strong>', '<em>'),
    L('다시 보는 굵게 및 기울임꼴', 'M', 'strong 안에 em을 중첩해 "Sale"을 작성하세요.', '서식 요소도 중첩할 수 있어 굵고 기울어진 텍스트를 만들 수 있습니다.', '<strong><em>Sale</em></strong>', '<strong>', '<em>', 'Sale'),
    L('요약 - 서식', 'C', 'h1, p, strong, em, br을 모두 사용해 간단한 소개글을 작성하세요.', '제목, 단락, 서식 요소를 조합합니다.', '<h1>Pizza House</h1>\n<p>Open <strong>daily</strong><br><em>Come visit!</em></p>', '<h1>', '<p>', '<strong>', '<em>', '<br>'),
  ] },
  { title: '리스트 다루기', lessons: [
    L('순서 없는 리스트', 'M', 'ul 안에 li "Apple", "Banana"를 작성하세요.', 'ul은 점으로 표시되는 순서 없는 목록, li는 각 항목입니다.', '<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n</ul>', '<ul>', '<li>', 'Apple', 'Banana'),
    L('순서 있는 리스트', 'M', 'ol 안에 li "Boil water", "Add pasta"를 작성하세요.', 'ol은 번호가 붙는 순서 있는 목록입니다.', '<ol>\n  <li>Boil water</li>\n  <li>Add pasta</li>\n</ol>', '<ol>', '<li>', 'Boil water'),
    L('중첩 리스트', 'M', 'ul 안의 li 안에 다시 ul을 넣으세요.', 'li 안에 ul이나 ol을 넣으면 하위 목록이 됩니다.', '<ul>\n  <li>Fruits\n    <ul>\n      <li>Apple</li>\n    </ul>\n  </li>\n</ul>', '<ul>', '<ul>', '<li>'),
    L('리스트 요약', 'C', 'ul과 ol을 모두 사용하고 하나는 중첩하세요.', '리스트 요소를 종합해 사용합니다.', '<ol>\n  <li>Prepare</li>\n  <li>Cook\n    <ul>\n      <li>Stir</li>\n    </ul>\n  </li>\n</ol>', '<ol>', '<ul>', '<li>'),
  ] },
  { title: '레시피 카드', lessons: [
    L('프로젝트 개요', 'C', 'h1 "Pancakes"를 작성하세요.', '제목, 재료, 조리 단계가 있는 레시피 카드를 만듭니다.', '<h1>Pancakes</h1>', '<h1>', 'Pancakes'),
    L('레시피 제목과 설명', 'P', 'h1 아래에 p 설명을 추가하세요.', '제목 아래에 한 줄 설명을 붙입니다.', '<h1>Pancakes</h1>\n<p>Fluffy breakfast pancakes</p>', '<h1>', '<p>'),
    L('재료', 'P', 'h2 "Ingredients"와 ul/li 재료 목록을 추가하세요.', '재료는 순서가 필요 없으므로 ul로 나열합니다.', '<h2>Ingredients</h2>\n<ul>\n  <li>Flour</li>\n  <li>Milk</li>\n</ul>', '<h2>', '<ul>', '<li>'),
    L('조리 단계', 'P', 'h2 "Steps"와 ol/li 단계 목록을 추가하세요.', '조리 순서는 번호가 필요하므로 ol로 나열합니다.', '<h2>Steps</h2>\n<ol>\n  <li>Mix</li>\n  <li>Cook</li>\n</ol>', '<h2>', '<ol>', '<li>'),
  ] },
  { title: '콘텐츠 추가하기', lessons: [
    L('HTML 속성', 'A', 'id 속성이 있는 p 요소를 작성하세요.', '속성은 여는 태그 안에 이름="값" 형태로 요소에 추가 정보를 줍니다.', '<p id="intro">Hello</p>', 'id="'),
    L('링크', 'M', 'href가 "https://example.com"인 a 요소에 "Visit"을 작성하세요.', 'a 요소의 href 속성에 이동할 주소를 적습니다.', '<a href="https://example.com">Visit</a>', '<a', 'href="https://example.com"', 'Visit'),
    L('새 페이지 링크', 'M', 'target="_blank"로 새 탭에서 열리는 링크를 만드세요.', 'target="_blank"는 링크를 새 탭에서 엽니다.', '<a href="https://example.com" target="_blank">Open</a>', 'target="_blank"'),
    L('이미지', 'M', 'img 요소에 src와 alt를 작성하세요.', 'img는 닫는 태그가 없고 src는 이미지 주소, alt는 대체 텍스트입니다.', '<img src="cat.png" alt="Cat">', '<img', 'src="', 'alt="'),
    L('이미지 속성', 'M', 'img에 width와 height를 지정하세요.', 'width, height 속성으로 이미지 크기를 정합니다.', '<img src="cat.png" alt="Cat" width="200" height="150">', 'width="', 'height="'),
  ] },
  { title: '페이지 레이아웃', lessons: [
    L('디비전', 'M', 'div 요소로 내용을 묶으세요.', 'div는 특별한 의미 없이 블록 영역을 묶는 요소입니다.', '<div>\n  <h2>Title</h2>\n  <p>Text</p>\n</div>', '<div>', '</div>'),
    L('인라인 스팬', 'M', 'p 안의 일부 글자를 span으로 감싸세요.', 'span은 줄 안에서 일부 텍스트를 묶는 인라인 요소입니다.', '<p>I like <span>pizza</span></p>', '<span>', '</span>'),
    L('시맨틱 태그', 'M', 'header, main, footer를 사용하세요.', 'header, nav, main, footer 같은 시맨틱 태그는 영역의 의미를 알려 줍니다.', '<header>Site</header>\n<main>Content</main>\n<footer>Bye</footer>', '<header>', '<main>', '<footer>'),
    L('섹션과 아티클', 'M', 'section 안에 article을 넣으세요.', 'section은 주제 영역, article은 독립적으로 읽을 수 있는 글입니다.', '<section>\n  <article>\n    <h2>Post</h2>\n  </article>\n</section>', '<section>', '<article>'),
    L('정리 - 레이아웃', 'C', 'header, nav, main(section), footer로 페이지를 구성하세요.', '시맨틱 요소로 페이지 뼈대를 만듭니다.', '<header><h1>Blog</h1></header>\n<nav>Menu</nav>\n<main>\n  <section>Posts</section>\n</main>\n<footer>Footer</footer>', '<header>', '<nav>', '<main>', '<footer>'),
  ] },
  { title: '개인 프로필 페이지', lessons: [
    L('프로젝트 개요', 'C', 'h1 "Jane Doe"를 작성하세요.', '이름, 사진, 소개, 링크가 있는 프로필 페이지를 만듭니다.', '<h1>Jane Doe</h1>', '<h1>', 'Jane Doe'),
    L('헤더 섹션', 'P', 'header 안에 이름과 직함을 넣으세요.', '페이지 상단은 header로 감쌉니다.', '<header>\n  <h1>Jane Doe</h1>\n  <p>Developer</p>\n</header>', '<header>', '<h1>', '<p>'),
    L('프로필 사진', 'P', 'alt가 있는 img를 추가하세요.', '프로필 사진에는 alt 텍스트를 넣습니다.', '<img src="me.png" alt="Jane">', '<img', 'alt='),
    L('자기소개 섹션', 'P', 'section 안에 h2 "About me"와 p를 추가하세요.', '소개글은 section으로 묶습니다.', '<section>\n  <h2>About me</h2>\n  <p>I love coding</p>\n</section>', '<section>', '<h2>', '<p>'),
    L('소셜 링크', 'P', 'a 링크 두 개를 ul/li로 추가하세요.', '링크 목록은 ul/li 안에 a를 넣어 만듭니다.', '<ul>\n  <li><a href="https://github.com">GitHub</a></li>\n  <li><a href="mailto:me@example.com">Email</a></li>\n</ul>', '<ul>', '<a', 'href='),
  ] },
  { title: '폼과 입력 요소 파트 1', lessons: [
    L('폼의 기초', 'A', 'form 안에 button "Send"를 넣으세요.', 'form은 사용자 입력을 모아 보내는 영역입니다.', '<form>\n  <button>Send</button>\n</form>', '<form>', '<button>'),
    L('텍스트 입력 요소', 'M', 'type이 "text"인 input을 작성하세요.', 'input 요소는 type 속성에 따라 입력칸의 모양이 달라집니다.', '<input type="text">', '<input', 'type="text"'),
    L('Input 속성', 'M', 'name, placeholder 속성이 있는 input을 작성하세요.', 'name은 데이터 이름, placeholder는 안내 문구입니다.', '<input type="text" name="user" placeholder="Name">', 'name="', 'placeholder="'),
    L('비밀번호 필드', 'M', 'type="password" input을 작성하세요.', 'password 타입은 입력 내용을 점으로 가립니다.', '<input type="password" name="pw">', 'type="password"'),
    L('Input을 위한 Label', 'M', 'label과 input을 for/id로 연결하세요.', 'label의 for와 input의 id가 같으면 서로 연결됩니다.', '<label for="email">Email</label>\n<input id="email" type="email">', '<label', 'for="', 'id="'),
    L('요약 - 기본 폼', 'C', 'label, input, button이 있는 로그인 폼을 만드세요.', '폼 요소를 종합합니다.', '<form>\n  <label for="id">ID</label>\n  <input id="id" type="text">\n  <label for="pw">PW</label>\n  <input id="pw" type="password">\n  <button>Login</button>\n</form>', '<form>', '<label', '<input', '<button>'),
  ] },
  { title: '폼과 입력 요소 파트 2', lessons: [
    L('라디오 버튼', 'M', '같은 name의 radio input 두 개를 만드세요.', '같은 name을 가진 radio 중 하나만 선택할 수 있습니다.', '<input type="radio" name="size" value="s"> S\n<input type="radio" name="size" value="m"> M', 'type="radio"', 'name="size"'),
    L('체크박스', 'M', 'checkbox input과 label을 작성하세요.', '체크박스는 켜고 끄는 선택에 사용합니다.', '<input type="checkbox" id="agree">\n<label for="agree">Agree</label>', 'type="checkbox"', '<label'),
    L('드롭다운', 'M', 'select와 option 두 개를 작성하세요.', 'select는 드롭다운 메뉴, option은 선택지입니다.', '<select>\n  <option>Red</option>\n  <option>Blue</option>\n</select>', '<select>', '<option>'),
    L('버튼', 'M', 'button 요소 "Click"을 작성하세요.', 'button은 클릭할 수 있는 버튼입니다.', '<button>Click</button>', '<button>', 'Click'),
    L('폼 내부의 버튼', 'M', 'form 안에 type="submit" button을 넣으세요.', 'submit 버튼은 폼을 제출합니다.', '<form>\n  <button type="submit">Send</button>\n</form>', 'type="submit"'),
    L('요약 - 폼 #1', 'C', 'radio, checkbox, button이 모두 있는 폼을 만드세요.', '여러 입력 요소를 조합합니다.', '<form>\n  <input type="radio" name="a"> Yes\n  <input type="checkbox"> Agree\n  <button>Send</button>\n</form>', 'type="radio"', 'type="checkbox"', '<button'),
    L('요약 - 폼 #2', 'C', 'select를 포함한 주문 폼을 만드세요.', '입력 요소를 더 많이 조합합니다.', '<form>\n  <select><option>Pizza</option></select>\n  <input type="number" name="qty">\n  <button>Order</button>\n</form>', '<select>', 'type="number"', '<button'),
  ] },
  { title: '테이블', lessons: [
    L('테이블 기초', 'M', 'table, tr, th, td로 표를 만드세요.', 'table 안에 행(tr)과 칸(td/th)을 넣어 표를 만듭니다. th는 제목 칸입니다.', '<table>\n  <tr><th>Name</th><th>Age</th></tr>\n  <tr><td>Kim</td><td>20</td></tr>\n</table>', '<table>', '<tr>', '<th>', '<td>'),
    L('캡션 추가하기', 'M', 'table에 caption을 추가하세요.', 'caption은 표의 제목을 나타냅니다.', '<table>\n  <caption>Members</caption>\n  <tr><td>Kim</td></tr>\n</table>', '<caption>'),
    L('행과 열 병합하기', 'M', 'colspan이나 rowspan으로 칸을 병합하세요.', 'colspan은 가로, rowspan은 세로로 칸을 합칩니다.', '<table>\n  <tr><td colspan="2">Merged</td></tr>\n  <tr><td>A</td><td>B</td></tr>\n</table>', 'colspan="'),
    L('테이블 요약', 'C', 'caption, th, td, colspan을 모두 사용한 표를 만드세요.', '표 요소를 종합합니다.', '<table>\n  <caption>Scores</caption>\n  <tr><th colspan="2">Math</th></tr>\n  <tr><td>Kim</td><td>90</td></tr>\n</table>', '<caption>', '<th', 'colspan='),
  ] },
  { title: '이벤트 등록 페이지', lessons: [
    L('프로젝트 개요', 'C', 'h1 "Tech Meetup"을 작성하세요.', '행사 안내와 등록 폼이 있는 페이지를 만듭니다.', '<h1>Tech Meetup</h1>', '<h1>', 'Tech Meetup'),
    L('헤더 섹션', 'P', 'header에 제목과 날짜를 넣으세요.', '페이지 상단을 header로 구성합니다.', '<header>\n  <h1>Tech Meetup</h1>\n  <p>Dec 1</p>\n</header>', '<header>', '<h1>'),
    L('이벤트 상세 섹션', 'P', 'section에 일시와 장소를 ul/li로 넣으세요.', '행사 정보를 목록으로 정리합니다.', '<section>\n  <h2>Details</h2>\n  <ul>\n    <li>Date: Dec 1</li>\n    <li>Place: Seoul</li>\n  </ul>\n</section>', '<section>', '<ul>', '<li>'),
    L('등록 폼', 'P', '이름, 이메일 input과 제출 버튼이 있는 form을 만드세요.', '참가 신청 폼을 만듭니다.', '<form>\n  <label for="n">Name</label>\n  <input id="n" type="text">\n  <label for="e">Email</label>\n  <input id="e" type="email">\n  <button>Register</button>\n</form>', '<form>', '<label', '<input', '<button>'),
    L('푸터 섹션', 'P', 'footer에 연락처를 넣으세요.', '페이지 하단은 footer로 마무리합니다.', '<footer>\n  <p>Contact: me@example.com</p>\n</footer>', '<footer>'),
  ] },
  { title: '최종 챌린지', lessons: [
    L('간단한 프로필 카드', 'C', 'img, 이름, 소개, 링크가 있는 프로필 카드를 만드세요.', '이미지·텍스트·링크를 조합합니다.', '<div>\n  <img src="me.png" alt="Me">\n  <h2>Kim</h2>\n  <p>Developer</p>\n  <a href="https://github.com">GitHub</a>\n</div>', '<img', '<h2>', '<a'),
    L('이벤트 초대장', 'C', '행사 제목, 정보 목록, 참가 버튼이 있는 초대장을 만드세요.', '제목·목록·폼 요소를 조합합니다.', '<h1>Party</h1>\n<ul>\n  <li>Dec 1</li>\n  <li>Seoul</li>\n</ul>\n<form><button>Join</button></form>', '<h1>', '<ul>', '<button>'),
    L('간단한 기사 페이지', 'C', 'header, article, footer로 기사 페이지를 만드세요.', '시맨틱 요소로 기사 구조를 만듭니다.', '<header><h1>News</h1></header>\n<article>\n  <h2>Title</h2>\n  <p>Body</p>\n</article>\n<footer>End</footer>', '<header>', '<article>', '<footer>'),
    L('좋아하는 도서 목록', 'C', '도서를 ol로 나열하고 각각 링크를 거세요.', '리스트와 링크를 조합합니다.', '<ol>\n  <li><a href="#">Book A</a></li>\n  <li><a href="#">Book B</a></li>\n</ol>', '<ol>', '<li>', '<a'),
  ] },
];
