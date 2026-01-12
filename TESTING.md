
---

### UC-AUTH-002: User Registration - Invalid Email
**Objective**: Verify validation rejects invalid email formats

**Steps**:
1. Click "Sign Up" button
2. Enter username: `testuser123`
3. Enter invalid email: `notanemail`
4. Enter password: `SecurePass123!`
5. Confirm password: `SecurePass123!`
6. Click "Create Account" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "Please enter a valid email address"
- ✅ Modal remains open
- ✅ User not logged in

**Test Cases**:
- `missing@domain` (missing TLD)
- `user@.com` (missing domain)
- `user.domain.com` (missing @)
- Empty field

---

### UC-AUTH-003: User Registration - Weak Password
**Objective**: Verify weak password validation

**Steps**:
1. Click "Sign Up" button
2. Enter username: `testuser123`
3. Enter email: `test@example.com`
4. Enter weak password: `123456`
5. Confirm password: `123456`
6. Click "Create Account" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "Password must be at least 6 characters" OR strong password requirement
- ✅ Modal remains open

**Test Cases**:
- `123456` (only numbers)
- `password` (too common)
- `aaa` (3 characters, too short)
- ` ` (space only)

---

### UC-AUTH-004: User Registration - Password Mismatch
**Objective**: Verify password confirmation validation

**Steps**:
1. Click "Sign Up" button
2. Enter username: `testuser123`
3. Enter email: `test@example.com`
4. Enter password: `SecurePass123!`
5. Confirm password: `DifferentPass123!`
6. Click "Create Account" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "Passwords do not match"
- ✅ Modal remains open

---

### UC-AUTH-005: User Registration - Duplicate Email
**Objective**: Verify system prevents duplicate account registration

**Steps**:
1. Register account with email: `duplicate@example.com`
2. Close modal, wait for auto-redirect
3. Click "Sign Up" again
4. Try registering with same email: `duplicate@example.com`
5. Enter new username: `newuser`
6. Enter password: `SecurePass123!`
7. Click "Create Account" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "Email already registered"
- ✅ Modal remains open

---

### UC-AUTH-006: User Login - Valid Credentials
**Objective**: Verify existing user can log in

**Steps**:
1. Register account with credentials (use UC-AUTH-001)
2. Sign out
3. Click "Sign In" button
4. Enter email: `testuser@example.com`
5. Enter password: `SecurePass123!`
6. Click "Sign In" button

**Expected Results**:
- ✅ Success message: "Login successful!"
- ✅ Modal closes
- ✅ "Sign Out" button appears
- ✅ User profile shows correct username
- ✅ Saved recipes are loaded

---

### UC-AUTH-007: User Login - Invalid Password
**Objective**: Verify system rejects incorrect password

**Steps**:
1. Click "Sign In" button
2. Enter email: `testuser@example.com` (existing account)
3. Enter password: `WrongPassword123!`
4. Click "Sign In" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "Invalid password"
- ✅ Modal remains open

---

### UC-AUTH-008: User Login - Non-existent Account
**Objective**: Verify system rejects login for non-existent email

**Steps**:
1. Click "Sign In" button
2. Enter email: `nonexistent@example.com`
3. Enter password: `AnyPassword123!`
4. Click "Sign In" button

**Expected Results**:
- ❌ Form rejects submission
- ✅ Error message: "User not found"
- ✅ Modal remains open

---

### UC-AUTH-009: Show/Hide Password Toggle
**Objective**: Verify password visibility toggle works

**Steps**:
1. Click "Sign In" button
2. Enter password: `SecurePass123!`
3. Verify text is masked (dots/asterisks)
4. Click eye icon to show password
5. Verify password is visible
6. Click eye icon again
7. Verify password is masked again

**Expected Results**:
- ✅ Icon changes between eye and eye-off
- ✅ Password toggles between masked and visible
- ✅ Works in both Sign In and Sign Up forms

---

### UC-AUTH-010: User Logout
**Objective**: Verify user can logout and session ends

**Steps**:
1. Log in successfully
2. Click "Sign Out" button
3. Verify redirect to home page
4. Refresh page
5. Verify user is not logged in

**Expected Results**:
- ✅ User logs out successfully
- ✅ Redirected to home page
- ✅ "Sign In" and "Sign Up" buttons appear
- ✅ Session data cleared from localStorage
- ✅ Saved recipes still persist for guest users

---

## Recipe Discovery Tests

### UC-DISC-001: View Homepage
**Objective**: Verify homepage loads with recipe recommendations

**Steps**:
1. Load application
2. Verify homepage is displayed
3. Scroll through all sections

**Expected Results**:
- ✅ Hero section displays correctly
- ✅ Category cards display (6 categories)
- ✅ "Recommended For You" section shows 4 recipes
- ✅ "Most Popular Recipes" section shows 4 recipes
- ✅ All recipe cards show: title, time, difficulty, description, rating
- ✅ Images or SVG placeholders load
- ✅ No console errors

---

### UC-DISC-002: Browse by Category
**Objective**: Verify user can filter recipes by meal time

**Steps**:
1. On homepage, click "Breakfast" category card
2. Verify page changes to "Recommended" view
3. Verify filter is set to "Breakfast"
4. Verify recipes displayed are breakfast items

**Expected Results**:
- ✅ Page navigates to Recommended page
- ✅ Breakfast filter is active (highlighted)
- ✅ Recipes shown are breakfast-related
- ✅ Recipe count displays correctly
- ✅ All 6 category cards are visible and functional

**Test All Categories**:
- 🍳 Breakfast
- 🍔 Lunch
- 🍗 Dinner
- 🍰 Dessert
- 🥗 Vegetarian
- ⚡ Quick Meals

---

### UC-DISC-003: Browse by Cuisine
**Objective**: Verify user can filter recipes by cuisine/area

**Steps**:
1. Navigate to "Recommended" page
2. In "By Cuisine" section, click "Italian"
3. Verify filter is active
4. Verify recipes are Italian cuisine

**Expected Results**:
- ✅ Italian filter is active (highlighted)
- ✅ Recipes displayed are Italian dishes
- ✅ Recipe count updates
- ✅ Can switch between cuisines easily

**Test All Cuisines**:
- 🇮🇹 Italian
- 🇲🇽 Mexican
- 🇹🇭 Thai
- 🇫🇷 French
- 🇺🇸 American

---

### UC-DISC-004: View All Recipes
**Objective**: Verify user can view all recipes

**Steps**:
1. On homepage, click "View All →" button
2. Verify navigates to Recommended page
3. Verify filter is set to "All"
4. Verify diverse recipes are shown

**Expected Results**:
- ✅ Navigates to Recommended page
- ✅ "All" filter is active
- ✅ Shows 12+ random recipes
- ✅ Mix of different categories and cuisines
- ✅ All recipe cards load properly

---

### UC-DISC-005: View Recipe Details
**Objective**: Verify user can view complete recipe information

**Steps**:
1. On any page, click a recipe card
2. Verify recipe detail page loads
3. Scroll through all sections

**Expected Results**:
- ✅ Recipe page displays
- ✅ Recipe image/SVG loads
- ✅ Title, badge, description visible
- ✅ Stats show: time, difficulty, servings, calories, rating
- ✅ Ingredients list displays with checkboxes
- ✅ Instructions display with numbered steps
- ✅ Action buttons (Save, Share, Watch Video) visible
- ✅ "Back to Recipes" button works

---

### UC-DISC-006: Check Recipe Ingredients
**Objective**: Verify ingredient list is complete and interactive

**Steps**:
1. View recipe detail page
2. Scroll to ingredients section
3. Click checkboxes next to ingredients
4. Verify items can be checked/unchecked

**Expected Results**:
- ✅ All ingredients display with measurements
- ✅ Checkboxes are interactive
- ✅ Checked items remain marked during session
- ✅ Can uncheck items
- ✅ Ingredient formatting is clear

---

### UC-DISC-007: Check Recipe Instructions
**Objective**: Verify cooking instructions display correctly

**Steps**:
1. View recipe detail page
2. Scroll to instructions section
3. Count steps
4. Verify formatting and readability

**Expected Results**:
- ✅ Instructions numbered sequentially
- ✅ Each step is clear and readable
- ✅ Step numbers in colored circles
- ✅ Text is properly formatted
- ✅ Instructions are complete

---

## Search Functionality Tests

### UC-SEARCH-001: Search by Recipe Name
**Objective**: Verify user can search recipes by name

**Steps**:
1. Click search bar at top
2. Type: `Pasta`
3. Press Enter or wait for debounce
4. Verify results display

**Expected Results**:
- ✅ Page navigates to Search page
- ✅ Results show recipes with "Pasta" in name
- ✅ Result count displays correctly
- ✅ All matching recipes shown
- ✅ Can click results to view details

**Test Searches**:
- `Chicken` (common ingredient)
- `Pasta` (common dish)
- `Soup` (meal type)
- `Dessert` (category)

---

### UC-SEARCH-002: Search with No Results
**Objective**: Verify appropriate message when no recipes found

**Steps**:
1. Click search bar
2. Type: `xyzabc123notarecipe`
3. Wait for search to complete
4. Verify no results page displays

**Expected Results**:
- ✅ "No recipes found" message displays
- ✅ Search emoji (🔍) shows
- ✅ Helpful text: "Try searching for something else"
- ✅ Can still perform new search

---

### UC-SEARCH-003: Clear Search & View Suggestions
**Objective**: Verify search page shows suggestions when empty

**Steps**:
1. Navigate to Search page
2. Clear search bar (don't type anything)
3. Verify suggestions display

**Expected Results**:
- ✅ Popular search tags display: Chicken, Pasta, Dessert, etc.
- ✅ Trending recipes section shows
- ✅ Can click tags to search
- ✅ Suggestions help guide users

---

### UC-SEARCH-004: Search Debounce
**Objective**: Verify search debounces to avoid excessive API calls

**Steps**:
1. Click search bar
2. Type slowly: `C` (pause) `h` (pause) `i` (pause) `c` (pause) `k` (pause) `e` (pause) `n`
3. Observe network requests (Dev Tools)
4. Verify only one final request is made

**Expected Results**:
- ✅ Only searches once after 300ms debounce
- ✅ No excessive API calls for each keystroke
- ✅ Results accurate for final query

---

### UC-SEARCH-005: Search Popular Tags
**Objective**: Verify clicking suggested tags performs search

**Steps**:
1. Go to Search page (empty)
2. Click "Chicken" tag
3. Verify search executes
4. Verify results show chicken recipes

**Expected Results**:
- ✅ Search bar fills with "Chicken"
- ✅ Results display immediately
- ✅ Works for all suggestion tags

**Test Tags**:
- Chicken
- Pasta
- Dessert
- Vegetarian
- Soup
- Beef
- Seafood
- Rice

---

## Save & Favorites Tests

### UC-SAVE-001: Save Recipe (Logged In)
**Objective**: Verify logged-in user can save recipes

**Steps**:
1. Log in successfully
2. Navigate to any recipe
3. Click bookmark icon
4. Verify recipe is saved

**Expected Results**:
- ✅ Bookmark button highlights (changes color)
- ✅ Button text changes to "Saved"
- ✅ Recipe added to saved list
- ✅ Saved state persists on page refresh
- ✅ Can access saved recipes from Profile

---

### UC-SAVE-002: Save Recipe (Not Logged In)
**Objective**: Verify non-logged-in users are prompted to login

**Steps**:
1. Do NOT log in
2. Navigate to any recipe card
3. Click bookmark icon
4. Verify auth modal appears

**Expected Results**:
- ✅ Auth modal opens with Sign In form
- ✅ Message: "Sign in to save recipes and access your collection"
- ✅ Can sign up or sign in to proceed

---

### UC-SAVE-003: Unsave Recipe
**Objective**: Verify user can unsave recipes

**Steps**:
1. Log in
2. Find a saved recipe
3. Click bookmark button (currently active)
4. Verify recipe is unsaved

**Expected Results**:
- ✅ Bookmark button becomes inactive
- ✅ Button text changes to "Save Recipe"
- ✅ Recipe removed from saved list
- ✅ Change persists on refresh

---

### UC-SAVE-004: View Saved Recipes
**Objective**: Verify user can see all saved recipes

**Steps**:
1. Log in
2. Save 3-5 recipes from various pages
3. Click "Profile" in navbar
4. View saved recipes section

**Expected Results**:
- ✅ Profile page displays
- ✅ "My Saved Recipes" section shows all saved recipes
- ✅ Recipe count displays correctly
- ✅ All saved recipes are clickable
- ✅ Can unsave from profile view

---

### UC-SAVE-005: Empty Saved Recipes
**Objective**: Verify message when no recipes are saved

**Steps**:
1. Log in with new account (no saved recipes)
2. Click "Profile"
3. View saved recipes section

**Expected Results**:
- ✅ Empty state displays: 📖 "No saved recipes yet"
- ✅ Message: "Start exploring and save your favorite recipes!"
- ✅ "Browse Recipes" button navigates to home
- ✅ Clean, inviting design

---

### UC-SAVE-006: Data Persistence Across Sessions
**Objective**: Verify saved recipes persist across app sessions

**Steps**:
1. Log in
2. Save 2-3 recipes
3. Navigate to Profile and verify saved
4. Close browser completely
5. Reopen app
6. Log in again
7. Check Profile

**Expected Results**:
- ✅ All previously saved recipes still there
- ✅ Save state persists
- ✅ No data loss on refresh or logout/login

---

## UI/UX & Responsive Design Tests

### UC-UI-001: Desktop Layout (1920x1080)
**Objective**: Verify app displays correctly on desktop

**Steps**:
1. Open app on desktop browser (1920x1080)
2. Navigate through all pages
3. Verify layout, spacing, alignment

**Expected Results**:
- ✅ Full-width layout utilized
- ✅ Navbar displays horizontally
- ✅ Recipe grid shows 4+ columns
- ✅ All text readable
- ✅ Buttons properly spaced
- ✅ No overlapping elements

---

### UC-UI-002: Tablet Layout (768x1024)
**Objective**: Verify app displays correctly on tablet

**Steps**:
1. Resize browser to 768x1024 (or use tablet)
2. Test on iPad, Android tablet
3. Navigate all pages
4. Test touch interactions

**Expected Results**:
- ✅ Mobile menu NOT visible (desktop navbar)
- ✅ Recipe grid shows 2-3 columns
- ✅ Touch targets are adequate size
- ✅ Buttons easily clickable
- ✅ Spacing appropriate for touch
- ✅ Readable font sizes

---

### UC-UI-003: Mobile Layout (375x667)
**Objective**: Verify app displays correctly on mobile

**Steps**:
1. Resize browser to 375x667 (iPhone SE)
2. Test on actual mobile devices
3. Navigate all pages
4. Test hamburger menu

**Expected Results**:
- ✅ Hamburger menu visible
- ✅ Recipe grid single column
- ✅ Text readable without zoom
- ✅ Touch targets adequate (44x44px minimum)
- ✅ No horizontal scrolling needed
- ✅ Modal/forms fit screen
- ✅ Images scale appropriately

---

### UC-UI-004: Mobile Menu Toggle
**Objective**: Verify hamburger menu functions on mobile

**Steps**:
1. On mobile view (< 768px)
2. Click hamburger menu icon
3. Verify menu opens
4. Click Home, Search, Recommended
5. Verify menu closes and page loads
6. Click menu again, verify opens

**Expected Results**:
- ✅ Menu icon visible on mobile
- ✅ Menu slides in smoothly
- ✅ All navigation links visible
- ✅ Profile link shows when logged in
- ✅ User actions (Sign In/Out) visible
- ✅ Menu closes on link click
- ✅ Smooth animation

---

### UC-UI-005: Navbar Responsive Design
**Objective**: Verify navbar adapts to screen size

**Steps**:
1. Start at desktop (1920px)
2. Slowly resize browser smaller
3. Observe navbar changes
4. At 768px, verify hamburger appears
5. Continue to 375px, verify layout

**Expected Results**:
- ✅ Desktop: horizontal menu visible
- ✅ Hamburger appears at breakpoint
- ✅ Logo always visible
- ✅ Search bar visible on desktop/tablet
- ✅ User actions visible appropriately
- ✅ No layout shifts during resize

---

### UC-UI-006: Recipe Card Responsiveness
**Objective**: Verify recipe cards display correctly on all sizes

**Steps**:
1. View homepage with recipe cards
2. Test on desktop (4 columns)
3. Resize to tablet (2-3 columns)
4. Resize to mobile (1 column)

**Expected Results**:
- ✅ Cards scale appropriately
- ✅ Images maintain aspect ratio
- ✅ Text doesn't overflow
- ✅ Hover effects on desktop
- ✅ Touch-friendly on mobile
- ✅ Card heights consistent

---

### UC-UI-007: Form Responsiveness
**Objective**: Verify forms display well on all devices

**Steps**:
1. Open Sign Up modal on desktop
2. Form displays in center modal
3. Resize to mobile (375px)
4. Verify form is still usable
5. Test input fields and buttons

**Expected Results**:
- ✅ Form fields full width on mobile
- ✅ Buttons adequately sized
- ✅ Modal doesn't overflow
- ✅ No horizontal scrolling
- ✅ Keyboard doesn't cover inputs
- ✅ Error messages visible

---

### UC-UI-008: Color & Contrast
**Objective**: Verify colors meet accessibility standards

**Steps**:
1. Use Chrome DevTools - Lighthouse
2. Check contrast ratios
3. Verify text on backgrounds
4. Use WebAIM contrast checker

**Expected Results**:
- ✅ All text has WCAG AA contrast (4.5:1)
- ✅ Buttons clearly distinguishable
- ✅ Interactive elements visible
- ✅ Color not the only indicator of state
- ✅ Links underlined or clearly indicated

---

### UC-UI-009: Typography & Readability
**Objective**: Verify fonts and sizing support readability

**Steps**:
1. Check heading sizes: h1, h2, h3
2. Check body text size (should be 14-16px)
3. Check line height (should be 1.5-1.8)
4. Test different content lengths

**Expected Results**:
- ✅ Hierarchy clear (h1 > h2 > h3)
- ✅ Body text 16px or larger
- ✅ Line height adequate
- ✅ No wall-of-text feeling
- ✅ Easy to scan

---

### UC-UI-010: Loading States
**Objective**: Verify loading indicators display properly

**Steps**:
1. On slow 3G connection (DevTools)
2. Search for recipes
3. Load recommended recipes
4. Watch for loading spinner
5. Verify smooth transition to content

**Expected Results**:
- ✅ Loading spinner displays
- ✅ Spinner animated smoothly
- ✅ "Loading delicious recipes..." message shows
- ✅ Spinner disappears when content loads
- ✅ No UI jumps or shifts

---

## API Integration Tests

### UC-API-001: MealDB Search Integration
**Objective**: Verify MealDB API integration works

**Steps**:
1. Search for: `Pasta`
2. Verify results load from MealDB
3. Check recipe details load
4. Verify ingredient data present
5. Verify instructions present

**Expected Results**:
- ✅ Search returns relevant results
- ✅ Recipe data populated correctly
- ✅ Ingredients and measurements complete
- ✅ Instructions are detailed
- ✅ Images display from MealDB
- ✅ No errors in console

---

### UC-API-002: MealDB Categories
**Objective**: Verify category filtering works via API

**Steps**:
1. Click "Breakfast" category
2. Verify API request to getByCategory
3. Check recipes returned are breakfast items
4. Switch to "Dinner"
5. Verify recipes change

**Expected Results**:
- ✅ Categories load from API
- ✅ Filtering works accurately
- ✅ Recipe data is correct for category
- ✅ No stale data displayed
- ✅ API calls are efficient

---

### UC-API-003: MealDB Areas (Cuisines)
**Objective**: Verify cuisine filtering works

**Steps**:
1. Select "Italian" cuisine
2. Verify API filters by area
3. Check recipes are Italian
4. Switch to "Thai"
5. Verify recipes change

**Expected Results**:
- ✅ Area/cuisine filtering works
- ✅ Recipes are appropriate cuisine
- ✅ Data updates immediately
- ✅ No wrong recipes displayed

---

### UC-API-004: Random Recipes
**Objective**: Verify random meal endpoint works

**Steps**:
1. Load homepage
2. Verify 8 random recipes load
3. Refresh page
4. Verify different recipes load

**Expected Results**:
- ✅ Random recipes display
- ✅ Recipes vary on refresh
- ✅ All data fields populated
- ✅ No duplicates in single load

---

### UC-API-005: API Error Handling
**Objective**: Verify graceful handling when API fails

**Steps**:
1. Disconnect internet
2. Try to search
3. Try to load home page
4. Verify error messages

**Expected Results**:
- ✅ Error message displays: "Failed to load recipes"
- ✅ User friendly error
- ✅ Doesn't crash app
- ✅ User can try again
- ✅ No console errors

---

### UC-API-006: API Timeout
**Objective**: Verify timeout handling for slow API

**Steps**:
1. Throttle network to slow 3G
2. Perform search
3. Monitor for timeout
4. Verify appropriate handling

**Expected Results**:
- ✅ Loading spinner shows
- ✅ Reasonable timeout (5-10 seconds)
- ✅ Error message if API slow
- ✅ User can retry
- ✅ App doesn't freeze

---

## Performance Tests

### UC-PERF-001: Page Load Time
**Objective**: Verify app loads quickly

**Steps**:
1. Open Chrome DevTools - Network tab
2. Open app fresh
3. Measure time to interactive
4. Measure total page load time
5. Check with slow 3G

**Expected Results**:
- ✅ Desktop: < 2 seconds to interactive
- ✅ Mobile 3G: < 5 seconds to interactive
- ✅ Total page size reasonable
- ✅ Critical assets load first

---

### UC-PERF-002: Search Response Time
**Objective**: Verify search returns results quickly

**Steps**:
1. Network tab open
2. Search for "Chicken"
3. Time API request
4. Time to results display

**Expected Results**:
- ✅ API response < 1 second
- ✅ Results display < 2 seconds
- ✅ No blocking operations
- ✅ Smooth user experience

---

### UC-PERF-003: Image Loading
**Objective**: Verify images load efficiently

**Steps**:
1. Load homepage with many recipes
2. Monitor image loading
3. Check image sizes
4. Verify no broken images

**Expected Results**:
- ✅ Images lazy load or progressive load
- ✅ No oversized images
- ✅ Appropriate formats (WebP where possible)
- ✅ All images eventually load
- ✅ SVG fallbacks display

---

### UC-PERF-004: Memory Usage
**Objective**: Verify app doesn't leak memory

**Steps**:
1. Chrome DevTools - Memory tab
2. Record memory baseline
3. Navigate to 10+ pages
4. Save/unsave 5+ recipes
5. Check memory growth
6. Check for memory leaks

**Expected Results**:
- ✅ Memory usage stable
- ✅ No memory leaks evident
- ✅ Reasonable memory footprint
- ✅ Garbage collection working

---

### UC-PERF-005: Scroll Performance
**Objective**: Verify smooth scrolling

**Steps**:
1. Load page with many items
2. Scroll through content
3. Monitor FPS (should be 60)
4. Test on mobile device

**Expected Results**:
- ✅ Smooth scrolling (60 FPS)
- ✅ No jank or stuttering
- ✅ Animation smooth
- ✅ Fast interaction response

---

## Bug Report Template

When you find an issue, please report using this format:

```markdown
## Bug Report

**Title**: [Brief description]

**Date Found**: [Date]

**Browser & OS**: [e.g., Chrome 120.0 on Windows 11]

**Severity**: [Critical/High/Medium/Low]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: 
[What should happen]

**Actual Result**: 
[What actually happened]

**Screenshots**: 
[Attach if helpful]

**Console Errors**: 
[Any error messages from Dev Tools]

**Notes**: 
[Any additional context]